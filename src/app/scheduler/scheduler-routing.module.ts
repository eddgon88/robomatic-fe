import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchedulerHomeComponent } from './pages/home/home.component';
import { ScheduleCreateEditComponent } from './pages/create-edit/create-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SchedulerHomeComponent
  },
  {
    path: 'create',
    component: ScheduleCreateEditComponent,
    data: { breadcrumb: 'Create' }
  },
  {
    path: 'edit/:scheduleId',
    component: ScheduleCreateEditComponent,
    data: { breadcrumb: 'Edit' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulerRoutingModule { }

