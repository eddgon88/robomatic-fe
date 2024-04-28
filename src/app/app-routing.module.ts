import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { AuthenticationGuard } from './guard/authentication-guard';
import { HomeComponent } from './pages/home/home.component';
import { NovncComponent } from './test/pages/novnc/novnc.component';
import { TestRoutingModule } from './test/test-routing.module';

const routes: Routes = [
{
  path: '',
  component: HomeComponent,
  children: [
    {
      path: 'tests',
      loadChildren: () => TestRoutingModule,
      canActivate: [AuthenticationGuard]
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
  path: '**',
  redirectTo: 'login'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
