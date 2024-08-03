import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidedOrdersReportsComponent } from './voided-orders-reports.component';

describe('VoidedOrdersReportsComponent', () => {
  let component: VoidedOrdersReportsComponent;
  let fixture: ComponentFixture<VoidedOrdersReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoidedOrdersReportsComponent]
    });
    fixture = TestBed.createComponent(VoidedOrdersReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
