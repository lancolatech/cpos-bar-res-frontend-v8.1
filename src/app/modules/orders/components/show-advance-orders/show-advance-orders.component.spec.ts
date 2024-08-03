import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAdvanceOrdersComponent } from './show-advance-orders.component';

describe('ShowAdvanceOrdersComponent', () => {
  let component: ShowAdvanceOrdersComponent;
  let fixture: ComponentFixture<ShowAdvanceOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowAdvanceOrdersComponent]
    });
    fixture = TestBed.createComponent(ShowAdvanceOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
