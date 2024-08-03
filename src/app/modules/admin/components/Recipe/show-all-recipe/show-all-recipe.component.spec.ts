import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllRecipeComponent } from './show-all-recipe.component';

describe('ShowAllRecipeComponent', () => {
  let component: ShowAllRecipeComponent;
  let fixture: ComponentFixture<ShowAllRecipeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowAllRecipeComponent]
    });
    fixture = TestBed.createComponent(ShowAllRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
