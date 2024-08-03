import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryReportsComponent } from './inventory-reports.component';

describe('InventoryReportsComponent', () => {
  let component: InventoryReportsComponent;
  let fixture: ComponentFixture<InventoryReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryReportsComponent]
    });
    fixture = TestBed.createComponent(InventoryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
