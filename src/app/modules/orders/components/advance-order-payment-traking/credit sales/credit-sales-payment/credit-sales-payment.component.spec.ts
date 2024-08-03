import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSalesPaymentComponent } from './credit-sales-payment.component';

describe('CreditSalesPaymentComponent', () => {
  let component: CreditSalesPaymentComponent;
  let fixture: ComponentFixture<CreditSalesPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditSalesPaymentComponent]
    });
    fixture = TestBed.createComponent(CreditSalesPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
