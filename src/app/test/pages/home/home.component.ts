import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';

import { NotificationService } from 'src/app/shared/services/notification.service';
import { TestRecord } from '../../interfaces/test-record';
import { FolderService } from '../../services/folder.service';
import { TestService } from '../../services/test.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
              private testService: TestService,
              private notificationService: NotificationService,
              private modalService: ModalService,
              private folderService: FolderService) { }

  displayedColumns: string[] = ['name', 'user', 'type', 'lastUpdate', 'lastExecution',"execute", 'state'];
  dataSource = new MatTableDataSource<TestRecord>();
  folder!: number;
  inLoad: boolean = false;

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if(params['folder'] === undefined) {
        this.folder = 0;
      } else {
        this.folder = params['folder'];
      }
      console.log(`folder: ${this.folder}`)
    })
  
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
        this.notificationService.showSuccess("Executing Test")
      },(err)=>{
        this.notificationService.showError("Error executing")
        console.debug(err)
        test.is_running = false;
      }
    )
  }

  stop(test: TestRecord): void {
    this.testService.stop(test.id).subscribe(
      resp=>{
        test.is_running = false;
        this.notificationService.showWarning("Stoping Test")
      },(err)=>{
        this.notificationService.showError("Error Stoping")
        console.debug(err)
      }
    )
  }

  async delete(test: TestRecord): Promise<void> {
    let bool = false;
    await this.modalService.modalConfirm("confirm").then(value => {
      bool = value
    });
    if(bool){
      this.testService.delete(test.id).subscribe(
        resp=>{
          this.notificationService.showWarning("Test deleted");
          this.dataSource.data = this.dataSource.data.filter(row => row.id !== test.id);
        },(err)=>{
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
      },(err)=>{
        this.notificationService.showError("Error creating folder")
        console.debug(err)
      }
    )
  }

  async createFolderModal(): Promise<void> {
    await this.modalService.modalInput("mesagge").then(value => {
      console.log("resp:" + value);
      if(value != false) this.createFolder(value);
    });
  }

  deleteFolder(folder: TestRecord): void {
    this.folderService.delete(folder.id).subscribe(
      resp => {
        this.notificationService.showWarning("Folder deleted");
        this.dataSource.data = this.dataSource.data.filter(row => row.id !== folder.id);
    }, (err) => {
      this.notificationService.showError("Error deleting folder")
      console.debug(err)
    })
  }

  async deleteFolderModal(folder: TestRecord): Promise<void> {
    this.modalService.modalConfirm("message").then(value => {
      if(value) this.deleteFolder(folder);
    })
  }

  deleteRecord(record: TestRecord): void {
    if(record.type === "test") {
      this.delete(record);
    } else {
      this.deleteFolderModal(record);
    }
  }

  webWatcherModal(test: TestRecord): void{
    this.testService.getExecutionPorts(test.id).subscribe(
      resp=>{
        this.modalService.modalWebWatcher("localhost", resp.vnc_port).then(value => {
          console.log("resp:" + value);
        });
      },(err)=>{
        this.notificationService.showError("Error Watching execution")
        console.debug(err)
      }
    )
  }

}
