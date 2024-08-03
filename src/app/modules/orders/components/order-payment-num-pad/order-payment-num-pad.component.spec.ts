import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentNumPadComponent } from './order-payment-num-pad.component';

describe('OrderPaymentNumPadComponent', () => {
  let component: OrderPaymentNumPadComponent;
  let fixture: ComponentFixture<OrderPaymentNumPadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderPaymentNumPadComponent]
    });
    fixture = TestBed.createComponent(OrderPaymentNumPadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
