import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './pages/create/create.component';
import { EvidenceDetailComponent } from './pages/evidence-detail/evidence-detail.component';
import { EvidenceComponent } from './pages/evidence/evidence.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'create',
        component: CreateComponent,
        data: { breadcrumb: 'Create' }
    },
    {
        path: 'edit/:testid',
        component: CreateComponent,
        data: { breadcrumb: 'Edit' }
    },
    {
        path: 'evidence/:testid',
        component: EvidenceComponent
    },
    {
        path: 'evidence/:testid/:executionid',
        component: EvidenceDetailComponent
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
