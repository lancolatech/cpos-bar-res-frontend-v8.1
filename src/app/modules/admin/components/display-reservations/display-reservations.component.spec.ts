import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayReservationsComponent } from './display-reservations.component';

describe('DisplayReservationsComponent', () => {
  let component: DisplayReservationsComponent;
  let fixture: ComponentFixture<DisplayReservationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayReservationsComponent]
    });
    fixture = TestBed.createComponent(DisplayReservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
