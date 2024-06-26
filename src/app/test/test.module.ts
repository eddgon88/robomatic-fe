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
import { VncModalComponent } from './modal/vnc-modal/vnc-modal.component';
import { NovncComponent } from './pages/novnc/novnc.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';



@NgModule({
  declarations: [
    HomeComponent,
    CreateComponent,
    EvidenceComponent,
    EvidenceDetailComponent,
    VncModalComponent,
    NovncComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    SharedModule,
    TestRoutingModule,
    RouterModule,
    FormsModule,
    MatMenuModule,
    MatToolbarModule,
    CodeEditorModule.forChild(),
  ]
})
export class TestModule { }
