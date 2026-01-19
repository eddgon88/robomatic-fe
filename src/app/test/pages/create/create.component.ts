import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CodeModel } from '@ngstack/code-editor';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TestModel } from '../../models/test-model';
import { NavigationTestService } from '../../services/navigation-test.service';
import { TestService } from '../../services/test.service';
import { CredentialService } from '../../services/credential.service';
import { CredentialModel, CredentialType, CreateCredentialRequest } from '../../models/credential-model';
import { Location } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

interface Step {
  title: string;
  subtitle: string;
  icon: string;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class CreateComponent implements OnInit {

  // Stepper
  currentStep = 0;
  steps: Step[] = [
    { title: 'Test Info', subtitle: 'Basic configuration', icon: 'bi-info-circle' },
    { title: 'Credentials', subtitle: 'Secrets & certs', icon: 'bi-shield-lock' },
    { title: 'Before Script', subtitle: 'Setup code', icon: 'bi-box-arrow-in-right' },
    { title: 'Main Script', subtitle: 'Test logic', icon: 'bi-code-slash' },
    { title: 'After Script', subtitle: 'Cleanup code', icon: 'bi-box-arrow-right' },
    { title: 'Test Cases', subtitle: 'CSV data', icon: 'bi-table' }
  ];

  // Permission control
  // Usuario con permiso de ejecutor solo puede:
  // - Ver Step 1 (Test Info) - solo lectura
  // - Editar Step 2 (Credentials)
  // - NO VER Steps 3, 4, 5 (Scripts) - completamente ocultos
  // - Editar Step 6 (Test Cases)
  isExecutorOnly = false;
  
  // Steps visibles para ejecutores (indices: 0=Info, 1=Credentials, 5=TestCases)
  executorVisibleSteps = [0, 1, 5];
  
  // Steps para el stepper (se filtra según permisos)
  get visibleSteps(): Step[] {
    if (this.isExecutorOnly) {
      return this.steps.filter((_, index) => this.executorVisibleSteps.includes(index));
    }
    return this.steps;
  }
  
  // Mapeo de índice visible a índice real
  getActualStepIndex(visibleIndex: number): number {
    if (this.isExecutorOnly) {
      return this.executorVisibleSteps[visibleIndex];
    }
    return visibleIndex;
  }
  
  // Mapeo de índice real a índice visible
  getVisibleStepIndex(actualIndex: number): number {
    if (this.isExecutorOnly) {
      return this.executorVisibleSteps.indexOf(actualIndex);
    }
    return actualIndex;
  }

  // Credentials
  credentials: CredentialModel[] = [];
  pendingCredentials: CredentialModel[] = []; // Para tests nuevos
  showCredentialForm = false;
  editingCredential: CredentialModel | null = null;
  newCredential: CredentialModel = {
    name: '',
    credential_type_id: CredentialType.PASSWORD,
    value: ''
  };
  CredentialType = CredentialType;

  // Code Editor Theme
  theme = 'vs-dark';

  // Code Models
  beforeScriptCodeModel: CodeModel = {
    language: 'python',
    uri: 'beforescript.py',
    value: '# Setup code - runs once before all test cases\n\n'
  };

  scriptCodeModel: CodeModel = {
    language: 'python',
    uri: 'main.py',
    value: '# Main test logic - runs for each test case\n# Access test case data with: caseData.column_name\n\n'
  };

  afterScriptCodeModel: CodeModel = {
    language: 'python',
    uri: 'afterscript.py',
    value: '# Cleanup code - runs once after all test cases\n\n'
  };

  casesCodeModel: CodeModel = {
    language: 'csv',
    uri: 'main.csv',
    value: 'column1,column2,expected\nvalue1,value2,result1\n'
  };

  editorOptions = {
    contextmenu: true,
    minimap: {
      enabled: false
    },
    fontSize: 14,
    lineHeight: 22,
    scrollBeyondLastLine: false,
    automaticLayout: true
  };

  // Data
  test = new TestModel();
  folder!: number;
  path!: string;
  testId!: number;

  constructor(
    private testService: TestService,
    private credentialService: CredentialService,
    private notificationService: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private navigationTestService: NavigationTestService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(url => {
      this.path = url[0].path;
      if (this.path === 'edit') {
        this.testId = +url[1].path;
      }
    });

    this.folder = this.navigationTestService.folderId ? this.navigationTestService.folderId : 0;
    
    if (this.path === 'edit') {
      this.getTest();
    }
  }

  // ========================================
  // STEPPER NAVIGATION
  // ========================================

  // Índice actual visible (para el stepper UI)
  currentVisibleStep = 0;

  nextStep(): void {
    // Para ejecutores, el step 0 es solo lectura, no necesita validación
    if (!this.isExecutorOnly && this.currentStep === 0 && !this.validateStep1()) {
      return;
    }
    
    if (this.isExecutorOnly) {
      // Navegar al siguiente step visible
      if (this.currentVisibleStep < this.executorVisibleSteps.length - 1) {
        this.currentVisibleStep++;
        this.currentStep = this.executorVisibleSteps[this.currentVisibleStep];
      }
    } else {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        this.currentVisibleStep++;
      }
    }
  }

  previousStep(): void {
    if (this.isExecutorOnly) {
      if (this.currentVisibleStep > 0) {
        this.currentVisibleStep--;
        this.currentStep = this.executorVisibleSteps[this.currentVisibleStep];
      }
    } else {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.currentVisibleStep--;
      }
    }
  }

  goToStep(index: number): void {
    if (this.isExecutorOnly) {
      // index es el índice visible, mapearlo al real
      if (index <= this.currentVisibleStep || index === this.currentVisibleStep + 1) {
        this.currentVisibleStep = index;
        this.currentStep = this.executorVisibleSteps[index];
      }
    } else {
      // Allow navigation to completed steps or next available step
      if (index <= this.currentStep || index === this.currentStep + 1) {
        if (index === this.currentStep + 1 && this.currentStep === 0 && !this.validateStep1()) {
          return;
        }
        this.currentStep = index;
        this.currentVisibleStep = index;
      }
    }
  }

  getProgressWidth(): string {
    const totalSteps = this.isExecutorOnly ? this.executorVisibleSteps.length : this.steps.length;
    const currentIdx = this.isExecutorOnly ? this.currentVisibleStep : this.currentStep;
    return `${(currentIdx / (totalSteps - 1)) * 100}%`;
  }

  isLastStep(): boolean {
    if (this.isExecutorOnly) {
      return this.currentVisibleStep === this.executorVisibleSteps.length - 1;
    }
    return this.currentStep === this.steps.length - 1;
  }

  validateStep1(): boolean {
    if (!this.test.name || this.test.name.trim() === '') {
      this.notificationService.showWarning('Please enter a test name');
      return false;
    }
    return true;
  }

  // ========================================
  // CODE EDITOR HANDLERS
  // ========================================

  onScriptCodeChanged(value: string): void {
    this.test.script = value;
  }

  onBeforeScriptCodeChanged(value: string): void {
    this.test.before_script = value;
  }

  onAfterScriptCodeChanged(value: string): void {
    this.test.after_script = value;
  }

  onTestCasesCodeChanged(value: string): void {
    this.test.test_cases = value;
  }

  // ========================================
  // CRUD OPERATIONS
  // ========================================

  create(): void {
    if (!this.validateStep1()) {
      this.currentStep = 0;
      return;
    }

    this.test.test_cases = btoa(this.test.test_cases);
    this.test.folder_id = this.folder;
    
    this.testService.create(this.test).subscribe({
      next: (response: any) => {
        // Guardar credenciales pendientes si hay alguna
        if (this.pendingCredentials.length > 0 && response.id) {
          this.savePendingCredentials(response.id);
        }
        this.notificationService.showSuccess('Test created successfully');
        this.router.navigate(['/tests/home']);
      },
      error: (err) => {
        this.notificationService.showError('Error creating test');
        console.error(err);
        // Restore test_cases for retry
        this.test.test_cases = atob(this.test.test_cases);
      }
    });
  }

  update(): void {
    if (!this.validateStep1()) {
      this.currentStep = 0;
      return;
    }

    this.test.test_cases = btoa(this.test.test_cases);
    this.test.folder_id = this.folder;
    
    this.testService.update(this.test).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Test updated successfully');
        this.router.navigate(['/tests/home']);
      },
      error: (err) => {
        this.notificationService.showError('Error updating test');
        console.error(err);
        // Restore test_cases for retry
        this.test.test_cases = atob(this.test.test_cases);
      }
    });
  }

  getTest(): void {
    this.testService.getTest(this.testId).subscribe({
      next: (response) => {
        this.test = response;
        this.test.test_cases = atob(this.test.test_cases);
        this.updateCasesModelValue(this.test.test_cases);
        this.updateScriptModelValue(this.test.script);
        this.updateAfterScriptModelValue(this.test.after_script);
        this.updateBeforeScriptModelValue(this.test.before_script);
        
        // Verificar si el usuario tiene solo permisos de ejecutor
        this.isExecutorOnly = this.test.permissions === 'execute';
        
        // Para ejecutores, iniciar en el step 0 visible (Test Info)
        if (this.isExecutorOnly) {
          this.currentVisibleStep = 0;
          this.currentStep = this.executorVisibleSteps[0];
        }
        
        // Cargar credenciales
        this.loadCredentials();
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showError('Error loading test');
      }
    });
  }

  // ========================================
  // CREDENTIALS MANAGEMENT
  // ========================================

  loadCredentials(): void {
    if (this.testId) {
      this.credentialService.getByTestId(this.testId).subscribe({
        next: (response) => {
          this.credentials = response;
        },
        error: (err) => {
          console.error('Error loading credentials:', err);
        }
      });
    }
  }

  openCredentialForm(credential?: CredentialModel): void {
    if (credential) {
      this.editingCredential = credential;
      this.newCredential = { ...credential };
    } else {
      this.editingCredential = null;
      this.newCredential = {
        name: '',
        credential_type_id: CredentialType.PASSWORD,
        value: ''
      };
    }
    this.showCredentialForm = true;
  }

  closeCredentialForm(): void {
    this.showCredentialForm = false;
    this.editingCredential = null;
    this.newCredential = {
      name: '',
      credential_type_id: CredentialType.PASSWORD,
      value: ''
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.newCredential.file_name = file.name;
      
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        this.newCredential.file_content = base64;
      };
      reader.readAsDataURL(file);
    }
  }

  saveCredential(): void {
    if (!this.newCredential.name) {
      this.notificationService.showWarning('Please enter a credential name');
      return;
    }

    if (this.newCredential.credential_type_id === CredentialType.PASSWORD && !this.newCredential.value && !this.editingCredential) {
      this.notificationService.showWarning('Please enter a password value');
      return;
    }

    if (this.newCredential.credential_type_id === CredentialType.CERTIFICATE && !this.newCredential.file_content && !this.editingCredential) {
      this.notificationService.showWarning('Please select a certificate file');
      return;
    }

    if (this.path === 'edit' && this.testId) {
      // En modo edición, guardar directamente al backend
      if (this.editingCredential) {
        this.updateCredentialOnServer();
      } else {
        this.createCredentialOnServer();
      }
    } else {
      // En modo creación, guardar en memoria
      if (this.editingCredential) {
        const index = this.pendingCredentials.findIndex(c => c.name === this.editingCredential!.name);
        if (index > -1) {
          this.pendingCredentials[index] = { ...this.newCredential };
        }
      } else {
        // Verificar que no exista una con el mismo nombre
        if (this.pendingCredentials.some(c => c.name === this.newCredential.name)) {
          this.notificationService.showWarning('A credential with this name already exists');
          return;
        }
        this.pendingCredentials.push({ ...this.newCredential });
      }
      this.closeCredentialForm();
    }
  }

  createCredentialOnServer(): void {
    const request: CreateCredentialRequest = {
      test_id: this.testId,
      credential_type_id: this.newCredential.credential_type_id,
      name: this.newCredential.name,
      value: this.newCredential.value,
      file_name: this.newCredential.file_name,
      file_content: this.newCredential.file_content
    };

    this.credentialService.create(request).subscribe({
      next: () => {
        this.notificationService.showSuccess('Credential created');
        this.loadCredentials();
        this.closeCredentialForm();
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showError('Error creating credential');
      }
    });
  }

  updateCredentialOnServer(): void {
    const request = {
      id: this.editingCredential!.id!,
      name: this.newCredential.name,
      value: this.newCredential.value,
      file_name: this.newCredential.file_name,
      file_content: this.newCredential.file_content
    };

    this.credentialService.update(request).subscribe({
      next: () => {
        this.notificationService.showSuccess('Credential updated');
        this.loadCredentials();
        this.closeCredentialForm();
      },
      error: (err) => {
        console.error(err);
        this.notificationService.showError('Error updating credential');
      }
    });
  }

  deleteCredential(credential: CredentialModel): void {
    if (this.path === 'edit' && credential.id) {
      this.credentialService.delete(credential.id).subscribe({
        next: () => {
          this.notificationService.showSuccess('Credential deleted');
          this.loadCredentials();
        },
        error: (err) => {
          console.error(err);
          this.notificationService.showError('Error deleting credential');
        }
      });
    } else {
      const index = this.pendingCredentials.findIndex(c => c.name === credential.name);
      if (index > -1) {
        this.pendingCredentials.splice(index, 1);
      }
    }
  }

  savePendingCredentials(testId: number): void {
    // Guardar credenciales pendientes después de crear el test
    this.pendingCredentials.forEach(cred => {
      const request: CreateCredentialRequest = {
        test_id: testId,
        credential_type_id: cred.credential_type_id,
        name: cred.name,
        value: cred.value,
        file_name: cred.file_name,
        file_content: cred.file_content
      };

      this.credentialService.create(request).subscribe({
        error: (err) => console.error('Error saving credential:', err)
      });
    });
  }

  getCredentialTypeName(typeId: number): string {
    return typeId === CredentialType.PASSWORD ? 'Password' : 'Certificate';
  }

  getDisplayCredentials(): CredentialModel[] {
    return this.path === 'edit' ? this.credentials : this.pendingCredentials;
  }

  // ========================================
  // CODE MODEL UPDATES
  // ========================================

  updateScriptModelValue(script: string): void {
    this.scriptCodeModel = {
      language: 'python',
      uri: 'main.py',
      value: script || ''
    };
  }

  updateBeforeScriptModelValue(script: string): void {
    this.beforeScriptCodeModel = {
      language: 'python',
      uri: 'beforescript.py',
      value: script || ''
    };
  }

  updateAfterScriptModelValue(script: string): void {
    this.afterScriptCodeModel = {
      language: 'python',
      uri: 'afterscript.py',
      value: script || ''
    };
  }

  updateCasesModelValue(cases: string): void {
    this.casesCodeModel = {
      language: 'csv',
      uri: 'main.csv',
      value: cases || ''
    };
  }

  // ========================================
  // NAVIGATION
  // ========================================

  goBack(): void {
    this.location.back();
  }
}
