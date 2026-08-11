import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AiAgent, AiAgentService } from '../../services/ai-agent.service';
import { NavigationAiService } from '../../services/navigation-ai.service';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';

@Component({
  selector: 'app-ai-create-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.css']
})
export class AiCreateEditComponent implements OnInit {




  agentForm!: FormGroup;
  isEdit = false;
  agentId?: number;
  folder_id = 0;

  llmProviders = [
    { name: 'OpenAI', models: ['gpt-5.4', 'gpt-5.3-codex', 'gpt-5.3-instant', 'gpt-4o', 'gpt-4o-mini', 'o1-preview'] },
    { name: 'Anthropic', models: ['claude-4-6-opus', 'claude-4-6-sonnet', 'claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'] },
    { name: 'Google', models: ['gemini-3.1-pro', 'gemini-3.1-flash-lite', 'gemini-2.0-flash', 'gemini-1.5-pro'] }
  ];

  selectedProvider = this.llmProviders[0];

  constructor(
    private fb: FormBuilder,
    private aiAgentService: AiAgentService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private navigationAiService: NavigationAiService,
    private location: Location,
    private breadcrumbService: BreadcrumbService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['folderId'] !== undefined) {
        this.folder_id = +queryParams['folderId'];
      } else {
        this.folder_id = this.navigationAiService.folderId || 0;
      }
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.agentId = +params['id'];
        this.loadAgent();
      }
      this.setupBreadcrumbs();
    });
  }

  private setupBreadcrumbs(): void {
    this.breadcrumbService.setBreadcrumbs([
      {
        label: 'AI Agents',
        url: '',
        action: () => {
          this.router.navigate(['/ai/agents']);
          this.navigationAiService.reset();
        }
      },
      {
        label: this.isEdit ? 'Edit Agent' : 'Create Agent',
        url: ''
      }
    ]);
  }

  initForm(): void {
    this.agentForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_ -]+$')]],
      role: ['', Validators.required],
      goal: ['', Validators.required],
      backstory: ['', Validators.required],
      company: ['OpenAI', Validators.required],
      llm: ['gpt-4o', Validators.required],
      max_iterations: [10, [Validators.required, Validators.min(1), Validators.max(50)]],
      verbose: [true],
      temperature: [0.7, [Validators.required, Validators.min(0), Validators.max(2)]]
    });

    this.agentForm.get('company')?.valueChanges.subscribe(company => {
      const provider = this.llmProviders.find(p => p.name === company);
      if (provider) {
        this.selectedProvider = provider;
        this.agentForm.get('llm')?.setValue(provider.models[0]);
      }
    });
  }

  loadAgent(): void {
    this.aiAgentService.getAgent(this.agentId!).subscribe({
      next: (agent) => {
        this.agentForm.patchValue(agent);
        const provider = this.llmProviders.find(p => p.name === agent.company);
        if (provider) this.selectedProvider = provider;
      },
      error: (err) => {
        this.notificationService.showError('Error loading agent');
        this.router.navigate(['/ai/agents']);
      }
    });
  }

  onSubmit(): void {
    if (this.agentForm.invalid) {
      this.notificationService.showWarning('Please correct the errors in the form');
      return;
    }

    const agentData: AiAgent = {
      ...this.agentForm.value,
      folder_id: this.folder_id
    };

    if (this.isEdit) {
      agentData.id = this.agentId;
      this.aiAgentService.update(agentData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Agent updated successfully');
          this.router.navigate(['/ai/agents']);
        },
        error: (err) => this.notificationService.showError('Error updating agent')
      });
    } else {
      this.aiAgentService.create(agentData).subscribe({
        next: () => {
          this.notificationService.showSuccess('Agent created successfully');
          this.router.navigate(['/ai/agents']);
        },
        error: (err) => this.notificationService.showError('Error creating agent')
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}
