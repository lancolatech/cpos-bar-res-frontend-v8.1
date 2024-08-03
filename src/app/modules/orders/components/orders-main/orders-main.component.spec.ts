import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersMainComponent } from './orders-main.component';

describe('OrdersMainComponent', () => {
  let component: OrdersMainComponent;
  let fixture: ComponentFixture<OrdersMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrdersMainComponent]
    });
    fixture = TestBed.createComponent(OrdersMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
