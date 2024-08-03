import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishesToOrderComponent } from './dishes-to-order.component';

describe('DishesToOrderComponent', () => {
  let component: DishesToOrderComponent;
  let fixture: ComponentFixture<DishesToOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DishesToOrderComponent]
    });
    fixture = TestBed.createComponent(DishesToOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
