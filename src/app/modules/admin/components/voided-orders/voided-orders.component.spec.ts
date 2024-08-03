import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidedOrdersComponent } from './voided-orders.component';

describe('VoidedOrdersComponent', () => {
  let component: VoidedOrdersComponent;
  let fixture: ComponentFixture<VoidedOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoidedOrdersComponent]
    });
    fixture = TestBed.createComponent(VoidedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
