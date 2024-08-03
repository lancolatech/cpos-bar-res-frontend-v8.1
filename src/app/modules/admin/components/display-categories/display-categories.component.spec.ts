import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayCategoriesComponent } from './display-categories.component';

describe('DisplayCategoriesComponent', () => {
  let component: DisplayCategoriesComponent;
  let fixture: ComponentFixture<DisplayCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayCategoriesComponent]
    });
    fixture = TestBed.createComponent(DisplayCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
