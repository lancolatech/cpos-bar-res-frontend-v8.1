import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSingleUserComponent } from './view-single-user.component';

describe('ViewSingleUserComponent', () => {
  let component: ViewSingleUserComponent;
  let fixture: ComponentFixture<ViewSingleUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSingleUserComponent]
    });
    fixture = TestBed.createComponent(ViewSingleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
