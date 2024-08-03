import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeOuteSaleComponent } from './take-oute-sale.component';

describe('TakeOuteSaleComponent', () => {
  let component: TakeOuteSaleComponent;
  let fixture: ComponentFixture<TakeOuteSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TakeOuteSaleComponent]
    });
    fixture = TestBed.createComponent(TakeOuteSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
