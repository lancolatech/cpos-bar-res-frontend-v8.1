import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncredientsComponent } from './incredients.component';

describe('IncredientsComponent', () => {
  let component: IncredientsComponent;
  let fixture: ComponentFixture<IncredientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncredientsComponent]
    });
    fixture = TestBed.createComponent(IncredientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
