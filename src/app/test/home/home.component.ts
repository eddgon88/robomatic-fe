import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TestRecord } from '../interfaces/test-record';
import { TestService } from '../services/test.service';

const ELEMENT_DATA: TestRecord[] = [
  {id:1, record_id: "T86758757", name: "test", user: "test@test.com", folder_id: 0, type: "Test", permissions: "owner", last_update: new Date(), last_execution: new Date(), last_execution_state: "success"}
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private testService: TestService) { }

  displayedColumns: string[] = ['name', 'user', 'type', 'lastUpdate', 'lastExecution', 'state', "execute"];
  dataSource = new MatTableDataSource<TestRecord>();
  folder: number = 0;

  ngOnInit(): void {
  
  this.getRecords();

  }

  getRecords(): void {
    this.testService.getRecordList(this.folder).subscribe(
      resp=>{
        this.dataSource.data = resp;
      },(err)=>{
        console.log(err)
      }
    )
  }
}
