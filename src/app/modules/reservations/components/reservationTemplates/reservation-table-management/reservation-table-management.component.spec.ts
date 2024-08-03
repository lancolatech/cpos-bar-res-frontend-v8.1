import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationTableManagementComponent } from './reservation-table-management.component';

describe('ReservationTableManagementComponent', () => {
  let component: ReservationTableManagementComponent;
  let fixture: ComponentFixture<ReservationTableManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReservationTableManagementComponent]
    });
    fixture = TestBed.createComponent(ReservationTableManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
