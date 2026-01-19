import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';

import { NotificationService } from 'src/app/shared/services/notification.service';
import { UserService } from 'src/app/shared/services/user.service';
import { TestRecord } from '../../interfaces/test-record';
import { FolderService } from '../../services/folder.service';
import { NavigationTestService } from '../../services/navigation-test.service';
import { TestService } from '../../services/test.service';
import { Permission, EXECUTE_PERMISSIONS, EDIT_PERMISSIONS, VIEW_PERMISSIONS } from 'src/app/shared/enums/permission.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private folderService: FolderService,
    private navigationTestService: NavigationTestService,
    private userService: UserService,
    private cdr: ChangeDetectorRef) { }

  // Constantes de permisos para usar en el template
  readonly executePermissions = EXECUTE_PERMISSIONS;
  readonly editPermissions = EDIT_PERMISSIONS;
  readonly viewPermissions = VIEW_PERMISSIONS;
  readonly Permission = Permission;
  readonly ownerPermission = [Permission.OWNER];

  displayedColumns: string[] = ['name', 'type', 'lastUpdate', 'lastExecution', "execute", 'state'];
  dataSource = new MatTableDataSource<TestRecord>();
  folder!: number;
  inLoad: boolean = false;
  canCreateTest: boolean = false;
  canSchedule: boolean = false;

  // ========================================
  // HELPER METHODS FOR STATS
  // ========================================

  getTestCount(): number {
    return this.dataSource.data.filter(item => item.type === 'test').length;
  }

  getFolderCount(): number {
    return this.dataSource.data.filter(item => item.type === 'folder').length;
  }

  getRunningCount(): number {
    return this.dataSource.data.filter(item => item.type === 'test' && item.is_running).length;
  }

  getSuccessCount(): number {
    return this.dataSource.data.filter(item => item.type === 'test' && item.last_execution_state === 'success').length;
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  ngOnInit(): void {
    this.checkUserRole();
    this.updateDisplayedColumns()
    this.getRecords();

    this.navigationTestService.suscribe(folderId => {
      this.folder = folderId;
      this.getRecords();
    });

  }

  private checkUserRole(): void {
    try {
      const token = sessionStorage.getItem('token');
      if (token) {
        const payload = this.decodeToken(token);
        if (payload && payload.role) {
          this.canCreateTest = payload.role === 'ADMIN' || payload.role === 'ANALYST';
          // Scheduler disponible para todos excepto VIEWER
          this.canSchedule = payload.role !== 'VIEWER';
        }
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  }

  private decodeToken(token: string): any {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = parts[1];
        const decoded = atob(payload);
        return JSON.parse(decoded);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    return null;
  }

  updateDisplayedColumns(): void {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 768) {
      this.displayedColumns = ['name', 'type', 'execute', 'state'];
    } else {
      this.displayedColumns = ['name', 'type', 'lastUpdate', 'lastExecution', 'execute', 'state'];
    }
  }

  getRecords(): void {
    this.inLoad = true;
    this.folder = this.navigationTestService.folderId ? this.navigationTestService.folderId : 0;
    this.testService.getRecordList(this.folder).subscribe(
      resp => {
        this.dataSource.data = resp;
      }, (err) => {
        console.log(err)
      }
    )
    this.inLoad = false;
  }

  execute(test: TestRecord): void {
    test.is_running = true;
    this.cdr.detectChanges(); // Forzar detección de cambios para actualizar botones
    this.testService.execute(test.id).subscribe(
      resp => {
        this.notificationService.showSuccess("Executing Test")
      }, (err) => {
        this.notificationService.showError("Error executing")
        console.debug(err)
        test.is_running = false;
        this.cdr.detectChanges(); // Forzar detección de cambios para actualizar botones
      }
    )
  }

  stop(test: TestRecord): void {
    this.testService.stop(test.id).subscribe(
      resp => {
        test.is_running = false;
        this.cdr.detectChanges(); // Forzar detección de cambios para actualizar botones
        this.notificationService.showWarning("Stoping Test")
      }, (err) => {
        this.notificationService.showError("Error Stoping")
        console.debug(err)
      }
    )
  }

  async delete(test: TestRecord): Promise<void> {
    let bool = false;
    await this.modalService.modalConfirm("test", test.name).then(value => {
      bool = value
    });
    if (bool) {
      this.testService.delete(test.id).subscribe(
        resp => {
          this.notificationService.showWarning("Test deleted");
          // Filtrar por id Y tipo para evitar eliminar folders con el mismo id
          this.dataSource.data = this.dataSource.data.filter(row => !(row.id === test.id && row.type === 'test'));
        }, (err) => {
          this.notificationService.showError("Error deleting")
          console.debug(err)
        }
      )
    }
  }

  createFolder(folderName: string): void {
    this.folderService.create(folderName, this.folder).subscribe(
      resp => {
        let data = this.dataSource.data;
        data.push(resp);
        this.dataSource.data = data;
        this.notificationService.showSuccess("Folder created successfully");
      }, (err) => {
        this.notificationService.showError("Error creating folder")
        console.debug(err)
      }
    )
  }

  async createFolderModal(): Promise<void> {
    await this.modalService.modalInput("mesagge").then(value => {
      console.log("resp:" + value);
      if (value != false) this.createFolder(value);
    });
  }

  deleteFolder(folder: TestRecord): void {
    this.folderService.delete(folder.id).subscribe(
      resp => {
        this.notificationService.showWarning("Folder deleted");
        // Filtrar por id Y tipo para evitar eliminar tests con el mismo id
        this.dataSource.data = this.dataSource.data.filter(row => !(row.id === folder.id && row.type === 'folder'));
      }, (err) => {
        this.notificationService.showError("Error deleting folder")
        console.debug(err)
      })
  }

  async deleteFolderModal(folder: TestRecord): Promise<void> {
    this.modalService.modalConfirm("folder", folder.name).then(value => {
      if (value) this.deleteFolder(folder);
    })
  }

  deleteRecord(record: TestRecord): void {
    if (record.type === "test") {
      this.delete(record);
    } else {
      this.deleteFolderModal(record);
    }
  }

  webWatcherModal(test: TestRecord): void {
    this.testService.getExecutionPorts(test.id).subscribe(
      resp => {
        console.log("resp:" + resp);
        this.modalService.modalWebWatcher("robomatic.cloud", resp.vnc_port).then(value => {
          console.log("resp:" + value);
        });
      }, (err) => {
        this.notificationService.showError("Error Watching execution")
        console.debug(err)
      }
    )
  }

  viewRecord(record: TestRecord): void {
    if (record.type === "folder") {
      console.log(record);
      this.navigationTestService.publishFolder(record.id, record.name);
    } else {
      this.router.navigate(['/tests/evidence/' + record.id])
    }
  }

  /**
   * Método que carga usuarios antes de abrir el modal (para tests)
   * 
   * La lista de usuarios excluye:
   * - Al usuario actual
   * - A los administradores
   * - Al owner del test
   * - A usuarios que ya tienen permisos sobre el test
   * 
   * @deprecated Usar shareWithPreload en su lugar
   */
  async shareTestWithPreload(test: TestRecord): Promise<void> {
    await this.shareWithPreload(test);
  }

  /**
   * Método unificado para compartir tests y folders
   * Carga usuarios antes de abrir el modal
   * 
   * Para tests:
   * - Permite seleccionar el tipo de permiso (view, execute, edit)
   * 
   * Para folders:
   * - Siempre asigna permiso 'view' por defecto
   * 
   * La lista de usuarios excluye:
   * - Al usuario actual
   * - A los administradores
   * - Al owner del item
   * - A usuarios que ya tienen permisos sobre el item
   */
  async shareWithPreload(item: TestRecord): Promise<void> {
    const isFolder = item.type === 'folder';
    const itemType = isFolder ? 'folder' : 'test';

    // Mostrar loading
    this.notificationService.showInfo('Cargando usuarios...');

    // Cargar usuarios según el tipo
    const getUsersObservable = isFolder
      ? this.userService.getUsersForSharingFolder(item.id)
      : this.userService.getUsersForSharing(item.id);

    getUsersObservable.subscribe({
      next: async (users) => {
        // Verificar si hay usuarios disponibles
        if (users.length === 0) {
          this.notificationService.showWarning(`No hay usuarios disponibles para compartir este ${itemType}`);
          return;
        }

        // Abrir modal con usuarios cargados (indicando si es folder)
        const result = await this.modalService.modalShare(item.id, item.name, users, false, isFolder);

        if (result) {
          // Usar el método correspondiente según el tipo
          const shareObservable = isFolder
            ? this.userService.shareFolder(item.id, result.userId)
            : this.userService.shareTest(item.id, result.userId, result.permission);

          shareObservable.subscribe({
            next: (resp) => {
              this.notificationService.showSuccess(`${isFolder ? 'Folder' : 'Test'} compartido exitosamente`);
            },
            error: (err) => {
              console.error(`Error sharing ${itemType}:`, err);
              this.notificationService.showError(`Error al compartir el ${itemType}`);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.notificationService.showError('Error al cargar usuarios');
      }
    });
  }

}
