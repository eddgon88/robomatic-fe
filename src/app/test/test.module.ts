import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule } from '@angular/material/table';

import { HomeComponent } from './pages/home/home.component';
import { CreateComponent } from './pages/create/create.component';
import { EvidenceComponent } from './pages/evidence/evidence.component';
import { SharedModule } from '../shared/shared.module';
import { TestRoutingModule } from './test-routing.module';



@NgModule({
  declarations: [
    HomeComponent,
    CreateComponent,
    EvidenceComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    SharedModule,
    TestRoutingModule
  ]
})
export class TestModule { }
