import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatTableModule } from '@angular/material/table';

import { HomeComponent } from './home/home.component';
import { CreateComponent } from './create/create.component';
import { EvidenceComponent } from './evidence/evidence.component';



@NgModule({
  declarations: [
    HomeComponent,
    CreateComponent,
    EvidenceComponent
  ],
  imports: [
    CommonModule,
    MatTableModule
  ],
  exports: [
    HomeComponent,
  ]
})
export class TestModule { }
