import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranferStockFromStorStoreeComponent } from './tranfer-stock-from-stor-storee.component';

describe('TranferStockFromStorStoreeComponent', () => {
  let component: TranferStockFromStorStoreeComponent;
  let fixture: ComponentFixture<TranferStockFromStorStoreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TranferStockFromStorStoreeComponent]
    });
    fixture = TestBed.createComponent(TranferStockFromStorStoreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
