import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PricingComponent } from './pricing.component';
import { PricingCardComponent } from '../../components/pricing-card/pricing-card.component';
import { CommonModule } from '@angular/common';

describe('PricingComponent', () => {
  let component: PricingComponent;
  let fixture: ComponentFixture<PricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricingComponent, PricingCardComponent ],
      imports: [ CommonModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize 3 pricing plans', () => {
    expect(component.pricingPlans.length).toBe(3);
  });

  it('should have pricing plans with correct IDs', () => {
    const planIds = component.pricingPlans.map(p => p.id);
    expect(planIds).toContain('basico');
    expect(planIds).toContain('profesional');
    expect(planIds).toContain('empresarial');
  });

  it('should highlight the professional plan', () => {
    const professionalPlan = component.pricingPlans.find(p => p.id === 'profesional');
    expect(professionalPlan?.highlighted).toBe(true);
  });

  it('should have correct pricing for each plan', () => {
    const basicPlan = component.pricingPlans.find(p => p.id === 'basico');
    const professionalPlan = component.pricingPlans.find(p => p.id === 'profesional');
    const enterprisePlan = component.pricingPlans.find(p => p.id === 'empresarial');

    expect(basicPlan?.price).toBe(49990);
    expect(professionalPlan?.price).toBe(79990);
    expect(enterprisePlan?.price).toBe(99990);
  });

  it('should have features for each plan', () => {
    component.pricingPlans.forEach(plan => {
      expect(plan.features.length).toBeGreaterThan(0);
    });
  });
});
