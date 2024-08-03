import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentScannerComponent } from './order-payment-scanner.component';

describe('OrderPaymentScannerComponent', () => {
  let component: OrderPaymentScannerComponent;
  let fixture: ComponentFixture<OrderPaymentScannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderPaymentScannerComponent]
    });
    fixture = TestBed.createComponent(OrderPaymentScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
