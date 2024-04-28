import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VncModalComponent } from './vnc-modal.component';

describe('VncModalComponent', () => {
  let component: VncModalComponent;
  let fixture: ComponentFixture<VncModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VncModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VncModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
