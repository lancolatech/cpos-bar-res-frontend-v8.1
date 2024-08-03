import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuOrderItemsComponent } from './menu-order-items.component';

describe('MenuOrderItemsComponent', () => {
  let component: MenuOrderItemsComponent;
  let fixture: ComponentFixture<MenuOrderItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuOrderItemsComponent]
    });
    fixture = TestBed.createComponent(MenuOrderItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
