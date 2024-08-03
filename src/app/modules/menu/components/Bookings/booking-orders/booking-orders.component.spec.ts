import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingOrdersComponent } from './booking-orders.component';

describe('BookingOrdersComponent', () => {
  let component: BookingOrdersComponent;
  let fixture: ComponentFixture<BookingOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingOrdersComponent]
    });
    fixture = TestBed.createComponent(BookingOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
