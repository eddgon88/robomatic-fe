import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ModalComponent, NgbdModalInput, NgbdModalCodeEditor } from './components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { CodeEditorModule } from '@ngstack/code-editor';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';



import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

@NgModule({
  declarations: [
    SidebarComponent,
    TopbarComponent,
    ModalComponent,
    NgbdModalInput,
    NgbdModalCodeEditor,
    BreadcrumbComponent
  ],
  exports: [
    SidebarComponent,
    TopbarComponent,
    BreadcrumbComponent
  ],
  imports: [
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 150000, // 15 seconds
      closeButton: true,
      progressBar: true,
    }),
    CommonModule,
    RouterModule,
    FormsModule,
    MatMenuModule,
    MatToolbarModule,
    CodeEditorModule.forChild()
  ]
})
export class SharedModule { }
