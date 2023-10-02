import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule } from '@angular/material/table';

import { HomeComponent } from './pages/home/home.component';
import { CreateComponent } from './pages/create/create.component';
import { EvidenceComponent } from './pages/evidence/evidence.component';
import { SharedModule } from '../shared/shared.module';
import { TestRoutingModule } from './test-routing.module';
import { RouterModule } from '@angular/router';
import { CodeEditorModule } from '@ngstack/code-editor';
import { FormsModule } from '@angular/forms';
import { EvidenceDetailComponent } from './pages/evidence-detail/evidence-detail.component';



@NgModule({
  declarations: [
    HomeComponent,
    CreateComponent,
    EvidenceComponent,
    EvidenceDetailComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    SharedModule,
    TestRoutingModule,
    RouterModule,
    FormsModule,
    CodeEditorModule.forChild(),
  ]
})
export class TestModule { }
