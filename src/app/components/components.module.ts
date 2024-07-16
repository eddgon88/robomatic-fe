import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmMailComponent } from './pages/confirm-mail/confirm-mail.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ConfirmMailComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    MatMenuModule,
    MatToolbarModule,
    RouterModule,
  ]
})
export class ComponentsModule { }
