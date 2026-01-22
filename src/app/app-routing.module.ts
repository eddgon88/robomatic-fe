import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { AuthenticationGuard } from './guard/authentication-guard';
import { HomeComponent } from './pages/home/home.component';
import { NovncComponent } from './test/pages/novnc/novnc.component';
import { TestRoutingModule } from './test/test-routing.module';
import { SchedulerRoutingModule } from './scheduler/scheduler-routing.module';
import { ConfirmMailComponent } from './components/pages/confirm-mail/confirm-mail.component';
import { ForgotPasswordComponent } from './components/pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/pages/reset-password/reset-password.component';
import { TermsConditionsComponent } from './components/pages/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './components/pages/privacy-policy/privacy-policy.component';
import { SupportComponent } from './components/pages/support/support.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'tests',
        loadChildren: () => TestRoutingModule,
        canActivate: [AuthenticationGuard]
      },
      {
        path: 'scheduler',
        loadChildren: () => SchedulerRoutingModule,
        canActivate: [AuthenticationGuard],
        data: { breadcrumb: 'Scheduler' }
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'vnc',
    component: NovncComponent
  },
  {
    path: 'confirm-mail/:token',
    component: ConfirmMailComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password/:token',
    component: ResetPasswordComponent
  },
  {
    path: 'terms-conditions',
    component: TermsConditionsComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'support',
    component: SupportComponent
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing-page/landing-page.module').then(m => m.LandingPageModule)
  },
  {
    path: 'pricing',
    loadChildren: () => import('./pricing/pricing.module').then(m => m.PricingModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
