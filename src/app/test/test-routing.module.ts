import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './pages/create/create.component';
import { EvidenceComponent } from './pages/evidence/evidence.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
{
    path: 'home',
    component: HomeComponent
},
{
    path: 'create',
    component: CreateComponent
},
{
    path: 'edit/:testid',
    component: CreateComponent
},
{
    path: 'evidence/:testid',
    component: EvidenceComponent
},
{
    path: '**',
    redirectTo: 'home'
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestRoutingModule { }
