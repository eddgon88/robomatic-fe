import { Component, OnInit } from '@angular/core';
import { PricingPlan } from '../../components/pricing-card/pricing-card.component';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css']
})
export class PricingComponent implements OnInit {
  pricingPlans: PricingPlan[] = [];

  constructor() { }

  ngOnInit(): void {
    this.initializePricingPlans();
  }

  initializePricingPlans(): void {
    this.pricingPlans = [
      {
        id: 'basico',
        name: 'Básico',
        price: 49990,
        currency: '$',
        period: '/mes',
        description: 'Perfecto para comenzar',
        documents: '50',
        features: [
          '50 documentos incluidos',
          'Emisión electrónica de boletas',
          'Facturación automática',
          'Soporte horario hábil (L-V)',
          'Reportes por ejecución'
        ],
        highlighted: false
      },
      {
        id: 'profesional',
        name: 'Profesional',
        price: 79990,
        currency: '$',
        period: '/mes',
        description: 'Para empresas en crecimiento',
        documents: '200',
        features: [
          '200 documentos incluidos',
          'Emisión electrónica de boletas',
          'Facturación automática',
          'Reportes por ejecución'
        ],
        highlighted: true
      },
      {
        id: 'empresarial',
        name: 'Empresarial',
        price: 99990,
        currency: '$',
        period: '/mes',
        description: 'Solución completa sin límites',
        documents: 'Ilimitados',
        features: [
          'Documentos ilimitados',
          'Emisión electrónica de boletas',
          'Facturación automática',
          'Soporte 24/7',
          'Reportes por ejecución'
        ],
        highlighted: false,
        ctaText: 'Contactar Ventas',
        ctaLink: 'https://wa.me/56929827325'
      }
    ];
  }

  handleTrialSignup(planId: string): void {
    console.log(`Trial signup clicked for plan: ${planId}`);
    // TODO: Implement trial signup logic
    // This could navigate to a signup page, open a modal, or trigger other actions
  }
}
