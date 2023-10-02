import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';
import { FileEvidence } from '../../interfaces/file-evidence';
import { TestExecutionService } from '../../services/test-execution.service';
import { EvidenceComponent } from '../evidence/evidence.component';

@Component({
  selector: 'app-evidence-detail',
  templateUrl: './evidence-detail.component.html',
  styleUrls: ['./evidence-detail.component.css']
})
export class EvidenceDetailComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private testExecutionService: TestExecutionService,
    private modalService: ModalService,) { }

  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource<FileEvidence>();
  inLoad: boolean = false;
  executiionId!: string;

  ngOnInit(): void {

    this.activatedRoute.url.subscribe(url => {
      this.executiionId = url[2].path
    });
    console.log(this.executiionId)

    this.getFiles();

  }

  getFiles(): void {
    this.inLoad = true;
    this.testExecutionService.getFileList(this.executiionId).subscribe(
      resp=>{
        this.dataSource.data = resp;
        console.log(resp)
      },(err)=>{
        console.log(err)
      }
    )
    this.inLoad = false;
  }

  createFolderModal(evidence: FileEvidence): void{
    let content = atob(evidence.file_content);
    this.modalService.modalCodeeditor(content).then(value => {
      console.log("resp:" + value);
    });
  }

}
