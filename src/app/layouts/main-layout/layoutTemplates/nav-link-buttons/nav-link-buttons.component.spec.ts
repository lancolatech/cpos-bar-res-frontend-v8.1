import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavLinkButtonsComponent } from './nav-link-buttons.component';

describe('NavLinkButtonsComponent', () => {
  let component: NavLinkButtonsComponent;
  let fixture: ComponentFixture<NavLinkButtonsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavLinkButtonsComponent]
    });
    fixture = TestBed.createComponent(NavLinkButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
