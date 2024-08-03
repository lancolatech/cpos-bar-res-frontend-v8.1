import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAllIncredientsForReceipeComponent } from './request-all-incredients-for-receipe.component';

describe('RequestAllIncredientsForReceipeComponent', () => {
  let component: RequestAllIncredientsForReceipeComponent;
  let fixture: ComponentFixture<RequestAllIncredientsForReceipeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestAllIncredientsForReceipeComponent]
    });
    fixture = TestBed.createComponent(RequestAllIncredientsForReceipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
