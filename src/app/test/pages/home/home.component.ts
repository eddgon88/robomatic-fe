import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';

import { NotificationService } from 'src/app/shared/services/notification.service';
import { TestRecord } from '../../interfaces/test-record';
import { FolderService } from '../../services/folder.service';
import { NavigationTestService } from '../../services/navigation-test.service';
import { TestService } from '../../services/test.service';

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
    private navigationTestService: NavigationTestService) { }

  displayedColumns: string[] = ['name', 'user', 'type', 'lastUpdate', 'lastExecution', "execute", 'state'];
  dataSource = new MatTableDataSource<TestRecord>();
  folder!: number;
  inLoad: boolean = false;

  ngOnInit(): void {

    this.updateDisplayedColumns()
    this.getRecords();

    this.navigationTestService.suscribe(folderId => {
      this.folder = folderId;
      this.getRecords();
    });

  }

  updateDisplayedColumns(): void {
    const screenWidth = window.innerWidth;

    if (screenWidth <= 768) {
      this.displayedColumns = ['name', 'type', 'execute', 'state']; // Ocultar columnas
    } else {
      this.displayedColumns = ['name', 'user', 'type', 'lastUpdate', 'lastExecution', 'execute', 'state'];
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
    this.testService.execute(test.id).subscribe(
      resp => {
        this.notificationService.showSuccess("Executing Test")
      }, (err) => {
        this.notificationService.showError("Error executing")
        console.debug(err)
        test.is_running = false;
      }
    )
  }

  stop(test: TestRecord): void {
    this.testService.stop(test.id).subscribe(
      resp => {
        test.is_running = false;
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
          this.dataSource.data = this.dataSource.data.filter(row => row.id !== test.id);
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
        this.dataSource.data = this.dataSource.data.filter(row => row.id !== folder.id);
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

}
