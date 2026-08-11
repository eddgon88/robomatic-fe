import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TestRecord } from '../../../test/interfaces/test-record';
import { AiAgentService } from '../../services/ai-agent.service';
import { NavigationAiService } from '../../services/navigation-ai.service';
import { UserService, UserForSharing } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-ai-home',
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class AiHomeComponent implements OnInit {



  constructor(
    private router: Router,
    private aiAgentService: AiAgentService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private navigationAiService: NavigationAiService,
    private userService: UserService,
    private cdr: ChangeDetectorRef

  ) { }


  displayedColumns: string[] = ['name', 'type', 'actions'];
  dataSource = new MatTableDataSource<TestRecord>();
  folder: number = 0;
  inLoad: boolean = false;

  ngOnInit(): void {
    this.getRecords();
    this.navigationAiService.suscribe(folderId => {
      this.folder = folderId;
      this.getRecords();
    });
  }

  getRecords(): void {
    this.inLoad = true;
    this.folder = this.navigationAiService.folderId ? this.navigationAiService.folderId : 0;
    this.aiAgentService.getAgentList(this.folder).subscribe(
      resp => {
        this.dataSource.data = resp;
        this.inLoad = false;
        this.cdr.detectChanges();
      }, (err) => {
        console.log(err);
        this.inLoad = false;
        this.notificationService.showError("Error loading records");
      }
    );
  }

  async createFolderModal(): Promise<void> {
    await this.modalService.modalInput("Nombre de la carpeta").then(value => {
      if (value != false) this.createFolder(value);
    });
  }

  createFolder(folderName: string): void {
    this.aiAgentService.createFolder(folderName, this.folder).subscribe(
      resp => {
        this.getRecords();
        this.notificationService.showSuccess("Carpeta creada correctamente");
      }, (err) => {
        this.notificationService.showError("Error al crear carpeta")
      }
    );
  }

  async deleteRecord(record: TestRecord): Promise<void> {
    const type: 'folder' | 'test' = record.type === 'folder' ? 'folder' : 'test';
    const confirmed = await this.modalService.modalConfirm(type, record.name);

    if (confirmed) {
      if (record.type === 'folder') {
        this.aiAgentService.deleteFolder(record.id).subscribe(() => {
          this.notificationService.showWarning("Carpeta eliminada");
          this.getRecords();
        });
      } else {
        this.aiAgentService.delete(record.id).subscribe(() => {
          this.notificationService.showWarning("Agente eliminado");
          this.getRecords();
        });
      }
    }
  }

  viewRecord(record: TestRecord): void {
    if (record.type === "folder") {
      this.navigationAiService.publishFolder(record.id, record.name);
    } else {
      this.router.navigate(['/ai/agents/edit/' + record.id]);
    }
  }

  createAgent(): void {
    this.router.navigate(['/ai/agents/create'], { queryParams: { folderId: this.folder } });
  }

  getAgentCount(): number {
    return this.dataSource.data.filter(item => item.type === 'test').length;
  }

  getFolderCount(): number {
    return this.dataSource.data.filter(item => item.type === 'folder').length;
  }

  async openShareModal(record: TestRecord): Promise<void> {
    const isFolder = record.type === 'folder';
    let users: UserForSharing[] = [];
    
    // Load users for sharing
    const usersObs = isFolder ? 
      this.userService.getUsersForSharingAiAgentFolder(record.id) : 
      this.userService.getUsersForSharingAiAgent(record.id);

    usersObs.subscribe(u => {
      this.modalService.modalShare(record.id, record.name, u, false, isFolder).then(result => {
        if (result) {
          const shareObs = isFolder ?
            this.userService.shareAiAgentFolder(record.id, result.userId) :
            this.userService.shareAiAgent(record.id, result.userId, result.permission);
            
          shareObs.subscribe(() => {
            this.notificationService.showSuccess(`Compatido correctamente`);
            this.getRecords();
          });
        }
      });
    });

  }
}

