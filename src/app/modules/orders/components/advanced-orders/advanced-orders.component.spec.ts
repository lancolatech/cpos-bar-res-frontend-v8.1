import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedOrdersComponent } from './advanced-orders.component';

describe('AdvancedOrdersComponent', () => {
  let component: AdvancedOrdersComponent;
  let fixture: ComponentFixture<AdvancedOrdersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvancedOrdersComponent]
    });
    fixture = TestBed.createComponent(AdvancedOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
