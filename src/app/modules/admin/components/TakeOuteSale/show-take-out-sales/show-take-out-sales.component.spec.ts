import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTakeOutSalesComponent } from './show-take-out-sales.component';

describe('ShowTakeOutSalesComponent', () => {
  let component: ShowTakeOutSalesComponent;
  let fixture: ComponentFixture<ShowTakeOutSalesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowTakeOutSalesComponent]
    });
    fixture = TestBed.createComponent(ShowTakeOutSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
