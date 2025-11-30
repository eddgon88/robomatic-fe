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
    private location: Location) { }

  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource<FileEvidence>();
  inLoad: boolean = false;
  executiionId!: string;

  testId!: number;

  ngOnInit(): void {

    this.activatedRoute.url.subscribe(url => {
      this.testId = +url[1].path
      this.executiionId = url[2].path
      this.getTestDetails();
    });
    console.log(this.executiionId)

    this.getFiles();

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

  getFiles(): void {
    this.inLoad = true;
    this.testExecutionService.getFileList(this.executiionId).subscribe(
      resp => {
        this.dataSource.data = resp;
        console.log(resp)
      }, (err) => {
        console.log(err)
      }
    )
    this.inLoad = false;
  }

  createFolderModal(evidence: FileEvidence): void {
    let content = atob(evidence.file_content);
    this.modalService.modalCodeeditor(content).then(value => {
      console.log("resp:" + value);
    });
  }

  goBack(): void {
    this.location.back();
  }

}
