import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { ConfirmMailComponent } from './pages/confirm-mail/confirm-mail.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { SupportComponent } from './pages/support/support.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ConfirmMailComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    TermsConditionsComponent,
    PrivacyPolicyComponent,
    SupportComponent
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
