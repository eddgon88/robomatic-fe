import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from './notification/notification.component';



@NgModule({
  declarations: [
    SidebarComponent,
    TopbarComponent,
    NotificationComponent
  ],
  exports: [
    SidebarComponent,
    TopbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SharedModule { }
