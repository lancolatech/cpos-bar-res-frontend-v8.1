import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuMainPageComponent } from './menu-main-page.component';

describe('MenuMainPageComponent', () => {
  let component: MenuMainPageComponent;
  let fixture: ComponentFixture<MenuMainPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuMainPageComponent]
    });
    fixture = TestBed.createComponent(MenuMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
