import { Component, Input } from '@angular/core';

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: string;
  description: string;
  documents: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
  ctaLink?: string;
  ctaAction?: () => void;
}

@Component({
  selector: 'app-pricing-card',
  templateUrl: './pricing-card.component.html',
  styleUrls: ['./pricing-card.component.css']
})
export class PricingCardComponent {
  @Input() plan!: PricingPlan;

  handleCTA() {
    if (this.plan.ctaLink) {
      window.open(this.plan.ctaLink, '_blank');
    } else if (this.plan.ctaAction) {
      this.plan.ctaAction();
    }
  }
}
