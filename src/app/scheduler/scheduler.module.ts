import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SchedulerRoutingModule } from './scheduler-routing.module';
import { SchedulerHomeComponent } from './pages/home/home.component';
import { ScheduleCreateEditComponent } from './pages/create-edit/create-edit.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    SchedulerHomeComponent,
    ScheduleCreateEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    SchedulerRoutingModule,
    SharedModule
  ]
})
export class SchedulerModule { }


