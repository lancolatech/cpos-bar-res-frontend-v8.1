import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCreditSalesComponent } from './display-credit-sales.component';

describe('DisplayCreditSalesComponent', () => {
  let component: DisplayCreditSalesComponent;
  let fixture: ComponentFixture<DisplayCreditSalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayCreditSalesComponent]
    });
    fixture = TestBed.createComponent(DisplayCreditSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
