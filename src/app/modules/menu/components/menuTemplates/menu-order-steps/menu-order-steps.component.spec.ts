import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOrderStepsComponent } from './menu-order-steps.component';

describe('MenuOrderStepsComponent', () => {
  let component: MenuOrderStepsComponent;
  let fixture: ComponentFixture<MenuOrderStepsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuOrderStepsComponent]
    });
    fixture = TestBed.createComponent(MenuOrderStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
