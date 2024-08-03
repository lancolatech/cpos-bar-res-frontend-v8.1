import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentCardComponent } from './order-payment-card.component';

describe('OrderPaymentCardComponent', () => {
  let component: OrderPaymentCardComponent;
  let fixture: ComponentFixture<OrderPaymentCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderPaymentCardComponent]
    });
    fixture = TestBed.createComponent(OrderPaymentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
