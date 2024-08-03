import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferReportsComponent } from './stock-transfer-reports.component';

describe('StockTransferReportsComponent', () => {
  let component: StockTransferReportsComponent;
  let fixture: ComponentFixture<StockTransferReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockTransferReportsComponent]
    });
    fixture = TestBed.createComponent(StockTransferReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
