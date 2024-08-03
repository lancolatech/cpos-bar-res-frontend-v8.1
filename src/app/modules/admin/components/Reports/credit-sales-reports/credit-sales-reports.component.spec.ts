import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSalesReportsComponent } from './credit-sales-reports.component';

describe('CreditSalesReportsComponent', () => {
  let component: CreditSalesReportsComponent;
  let fixture: ComponentFixture<CreditSalesReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditSalesReportsComponent]
    });
    fixture = TestBed.createComponent(CreditSalesReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
