import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';
import { FileEvidence } from '../../interfaces/file-evidence';
import { TestExecutionService } from '../../services/test-execution.service';
import { EvidenceComponent } from '../evidence/evidence.component';
import { TestService } from '../../services/test.service';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { NavigationTestService } from '../../services/navigation-test.service';
import { AiInteractionService } from '../../services/ai-interaction.service';
import { AiInteraction } from '../../interfaces/ai-interaction';

import { Location } from '@angular/common';

@Component({
  selector: 'app-evidence-detail',
  templateUrl: './evidence-detail.component.html',
  styleUrls: ['./evidence-detail.component.css']
})
export class EvidenceDetailComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private testExecutionService: TestExecutionService,
    private modalService: ModalService,
    private testService: TestService,
    private breadcrumbService: BreadcrumbService,
    private navigationTestService: NavigationTestService,
    private location: Location,
    private aiInteractionService: AiInteractionService) { }

  displayedColumns: string[] = ['name', 'actions'];
  dataSource = new MatTableDataSource<FileEvidence>();
  inLoad: boolean = false;
  executiionId!: string;
  aiInteractions: AiInteraction[] = [];
  displayedAiColumns: string[] = ['agentName', 'prompt', 'response', 'status', 'createdAt'];

  testId!: number;

  ngOnInit(): void {

    this.activatedRoute.url.subscribe(url => {
      this.testId = +url[1].path
      this.executiionId = url[2].path
      this.getTestDetails();
    });
    console.log(this.executiionId)

    this.getFiles();
    this.getAiInteractions();

  }

  getTestDetails(): void {
    this.testService.getTest(this.testId).subscribe(test => {
      this.navigationTestService.updateBreadcrumbs();
      this.breadcrumbService.addBreadcrumb({
        label: test.name,
        url: `/tests/evidence/${this.testId}`
      });
      this.breadcrumbService.addBreadcrumb({
        label: this.executiionId,
        url: ''
      });
    });
  }

  contentLoadProgress = 0;
  totalFiles = 0;

  getFiles(): void {
    this.inLoad = true;
    this.testExecutionService.getFileNames(this.executiionId).subscribe(
      resp => {
        this.dataSource.data = resp;
        this.totalFiles = resp.length;
        this.inLoad = false;
        this.loadContentsInBackground(resp);
      }, (err) => {
        console.error(err);
        this.inLoad = false;
      }
    );
  }

  private loadContentsInBackground(files: FileEvidence[]): void {
    files.forEach(file => {
      this.testExecutionService.getFileContent(this.executiionId, file.file_name)
        .subscribe(resp => {
          file.file_content = resp.file_content;
          this.contentLoadProgress++;
        });
    });
  }

  getAiInteractions(): void {
    this.aiInteractionService.getByExecutionId(this.executiionId).subscribe({
      next: (resp) => {
        this.aiInteractions = resp;
      },
      error: (err) => {
        console.error('Error loading AI interactions:', err);
      }
    });
  }

  createFolderModal(evidence: FileEvidence): void {
    if (!evidence.file_content) {
      this.testExecutionService.getFileContent(this.executiionId, evidence.file_name)
        .subscribe(resp => {
          evidence.file_content = resp.file_content;
          this.openFileModal(evidence);
        });
    } else {
      this.openFileModal(evidence);
    }
  }

  private openFileModal(evidence: FileEvidence): void {
    const content = evidence.file_content;
    if (evidence.file_name.endsWith('.md')) {
      this.modalService.modalMarkdownViewer(content, evidence.file_name);
    } else {
      this.modalService.modalCodeeditor(content).then(value => {
        console.log("resp:" + value);
      });
    }
  }

  downloadFile(evidence: FileEvidence): void {
    if (!evidence.file_content) {
      this.testExecutionService.getFileContent(this.executiionId, evidence.file_name)
        .subscribe(resp => {
          evidence.file_content = resp.file_content;
          this.triggerDownload(evidence);
        });
    } else {
      this.triggerDownload(evidence);
    }
  }

  private triggerDownload(evidence: FileEvidence): void {
    const mimeType = this.getMimeType(evidence.file_name);
    const blob = new Blob([evidence.file_content], { type: mimeType });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = evidence.file_name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  downloadAll(): void {
    this.testExecutionService.downloadAllEvidences(this.executiionId).subscribe(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `evidences_${this.executiionId}.zip`;
      link.click();
      URL.revokeObjectURL(link.href);
    });
  }

  private getMimeType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'pdf': 'application/pdf',
      'txt': 'text/plain',
      'log': 'text/plain',
      'json': 'application/json',
      'xml': 'application/xml',
      'html': 'text/html',
      'csv': 'text/csv',
      'md': 'text/markdown',
      'mp4': 'video/mp4',
      'zip': 'application/zip'
    };
    return mimeTypes[ext || ''] || 'application/octet-stream';
  }

  goBack(): void {
    this.location.back();
  }

}

