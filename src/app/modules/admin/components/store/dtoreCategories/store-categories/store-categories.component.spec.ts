import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreCategoriesComponent } from './store-categories.component';

describe('StoreCategoriesComponent', () => {
  let component: StoreCategoriesComponent;
  let fixture: ComponentFixture<StoreCategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreCategoriesComponent]
    });
    fixture = TestBed.createComponent(StoreCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
