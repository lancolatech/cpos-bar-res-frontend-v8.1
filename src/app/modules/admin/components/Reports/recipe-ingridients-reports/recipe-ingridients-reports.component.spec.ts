import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeIngridientsReportsComponent } from './recipe-ingridients-reports.component';

describe('RecipeIngridientsReportsComponent', () => {
  let component: RecipeIngridientsReportsComponent;
  let fixture: ComponentFixture<RecipeIngridientsReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeIngridientsReportsComponent]
    });
    fixture = TestBed.createComponent(RecipeIngridientsReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
