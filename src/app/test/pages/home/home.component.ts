import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { elementAt } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { TestRecord } from '../../interfaces/test-record';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private testService: TestService,
              private notificationService: NotificationService) { }

  displayedColumns: string[] = ['name', 'user', 'type', 'lastUpdate', 'lastExecution',"execute", 'state'];
  dataSource = new MatTableDataSource<TestRecord>();
  folder: number = 0;
  inLoad: boolean = false;

  ngOnInit(): void {
  
  this.getRecords();

  }

  getRecords(): void {
    this.inLoad = true;
    this.testService.getRecordList(this.folder).subscribe(
      resp=>{
        this.dataSource.data = resp;
      },(err)=>{
        console.log(err)
      }
    )
    this.inLoad = false;
  }

  execute(test: TestRecord): void {
    test.is_running = true;
    this.testService.execute(test.id).subscribe(
      resp=>{
        this.notificationService.showSuccess("Ejecutando Test")
      },(err)=>{
        this.notificationService.showError("Error en ejecución")
        console.debug(err)
        test.is_running = false;
      }
    )
  }

}
