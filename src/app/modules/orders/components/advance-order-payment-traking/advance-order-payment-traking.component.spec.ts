import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceOrderPaymentTrakingComponent } from './advance-order-payment-traking.component';

describe('AdvanceOrderPaymentTrakingComponent', () => {
  let component: AdvanceOrderPaymentTrakingComponent;
  let fixture: ComponentFixture<AdvanceOrderPaymentTrakingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvanceOrderPaymentTrakingComponent]
    });
    fixture = TestBed.createComponent(AdvanceOrderPaymentTrakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
