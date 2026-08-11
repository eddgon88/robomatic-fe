import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { ModalComponent, NgbdModalInput, NgbdModalCodeEditor, NgbdModalShare, NgbdModalExecutionLimit, NgbdModalMarkdownViewer } from './components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { CodeEditorModule } from '@ngstack/code-editor';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';


import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { HasPermissionDirective } from './directives/has-permission.directive';

@NgModule({
  declarations: [
    SidebarComponent,
    TopbarComponent,
    ModalComponent,
    NgbdModalInput,
    NgbdModalCodeEditor,
    NgbdModalShare,
    NgbdModalExecutionLimit,
    NgbdModalMarkdownViewer,
    BreadcrumbComponent,
    HasPermissionDirective
  ],
  exports: [
    SidebarComponent,
    TopbarComponent,
    BreadcrumbComponent,
    HasPermissionDirective,
    MatTableModule
  ],

  imports: [
    ToastrModule,
    CommonModule,
    RouterModule,
    FormsModule,
    MatMenuModule,
    MatToolbarModule,
    MatTableModule,
    CodeEditorModule.forChild()

  ]
})
export class SharedModule { }
