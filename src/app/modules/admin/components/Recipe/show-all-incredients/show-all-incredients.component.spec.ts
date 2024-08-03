import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAllIncredientsComponent } from './show-all-incredients.component';

describe('ShowAllIncredientsComponent', () => {
  let component: ShowAllIncredientsComponent;
  let fixture: ComponentFixture<ShowAllIncredientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowAllIncredientsComponent]
    });
    fixture = TestBed.createComponent(ShowAllIncredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
