import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PricingCardComponent } from './pricing-card.component';
import { CommonModule } from '@angular/common';

describe('PricingCardComponent', () => {
  let component: PricingCardComponent;
  let fixture: ComponentFixture<PricingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricingCardComponent ],
      imports: [ CommonModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingCardComponent);
    component = fixture.componentInstance;

    // Mock a plan
    component.plan = {
      id: 'test',
      name: 'Test Plan',
      price: 50000,
      currency: '$',
      period: '/mes',
      description: 'Test Description',
      documents: '50',
      features: ['Feature 1', 'Feature 2'],
      highlighted: false,
      ctaText: 'Get Started',
      ctaAction: jasmine.createSpy('ctaAction')
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display plan name', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Test Plan');
  });

  it('should display plan price', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('50000');
  });

  it('should display plan documents', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('50');
  });

  it('should display all features', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Feature 1');
    expect(compiled.textContent).toContain('Feature 2');
  });

  it('should not show featured badge when highlighted is false', () => {
    component.plan.highlighted = false;
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.featured-badge');
    expect(badge).toBeFalsy();
  });

  it('should show featured badge when highlighted is true', () => {
    component.plan.highlighted = true;
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.featured-badge');
    expect(badge).toBeTruthy();
  });

  it('should call ctaAction when button is clicked', () => {
    const button = fixture.nativeElement.querySelector('.cta-button');
    button.click();
    expect(component.plan.ctaAction).toHaveBeenCalled();
  });

  it('should apply highlighted class when plan is highlighted', () => {
    component.plan.highlighted = true;
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('.pricing-card');
    expect(card.classList.contains('highlighted')).toBe(true);
  });
});
