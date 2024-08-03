import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedOrdersPaymentComponent } from './advanced-orders-payment.component';

describe('AdvancedOrdersPaymentComponent', () => {
  let component: AdvancedOrdersPaymentComponent;
  let fixture: ComponentFixture<AdvancedOrdersPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedOrdersPaymentComponent]
    });
    fixture = TestBed.createComponent(AdvancedOrdersPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
