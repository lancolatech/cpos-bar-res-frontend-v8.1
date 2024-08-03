import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTagComponent } from './shift-tag.component';

describe('ShiftTagComponent', () => {
  let component: ShiftTagComponent;
  let fixture: ComponentFixture<ShiftTagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShiftTagComponent]
    });
    fixture = TestBed.createComponent(ShiftTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
