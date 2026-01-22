import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PricingComponent } from './pages/pricing/pricing.component';
import { PricingCardComponent } from './components/pricing-card/pricing-card.component';

const routes: Routes = [
  {
    path: '',
    component: PricingComponent
  }
];

@NgModule({
  declarations: [
    PricingComponent,
    PricingCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class PricingModule { }
