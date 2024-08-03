import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBottomNavComponent } from './menu-bottom-nav.component';

describe('MenuBottomNavComponent', () => {
  let component: MenuBottomNavComponent;
  let fixture: ComponentFixture<MenuBottomNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuBottomNavComponent]
    });
    fixture = TestBed.createComponent(MenuBottomNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
