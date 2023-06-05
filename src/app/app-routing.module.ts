import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './test/pages/home/home.component';
import { TestRoutingModule } from './test/test-routing.module';

const routes: Routes = [
{
  path: 'tests',
  loadChildren: () => TestRoutingModule
},
{
  path: '**',
  redirectTo: 'tests'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
