import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayUpsaleCardComponent } from './day-upsale-card.component';

describe('DayUpsaleCardComponent', () => {
  let component: DayUpsaleCardComponent;
  let fixture: ComponentFixture<DayUpsaleCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DayUpsaleCardComponent]
    });
    fixture = TestBed.createComponent(DayUpsaleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
