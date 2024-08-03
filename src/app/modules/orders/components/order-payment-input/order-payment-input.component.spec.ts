import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentInputComponent } from './order-payment-input.component';

describe('OrderPaymentInputComponent', () => {
  let component: OrderPaymentInputComponent;
  let fixture: ComponentFixture<OrderPaymentInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderPaymentInputComponent]
    });
    fixture = TestBed.createComponent(OrderPaymentInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
