import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TestExecutionRecord } from '../../interfaces/test-execution-record';
import { TestExecutionService } from '../../services/test-execution.service';

@Component({
  selector: 'app-evidence',
  templateUrl: './evidence.component.html',
  styleUrls: ['./evidence.component.css']
})
export class EvidenceComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
              private testExecutionService: TestExecutionService) { }

  displayedColumns: string[] = ['date', 'hour', 'user', 'status', 'evidence'];
  dataSource = new MatTableDataSource<TestExecutionRecord>();
  inLoad: boolean = false;
  testId!: number;

  ngOnInit(): void {
    this.activatedRoute.url.subscribe(url => {
      this.testId = +url[1].path
    });

    this.getRecords();

  }

  getRecords(): void {
    this.inLoad = true;
    this.testExecutionService.getRecordList(this.testId).subscribe(
      resp=>{
        this.dataSource.data = resp;
      },(err)=>{
        console.log(err)
      }
    )
    this.inLoad = false;
  }

}
