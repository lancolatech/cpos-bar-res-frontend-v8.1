import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPettyCashComponent } from './add-petty-cash.component';

describe('AddPettyCashComponent', () => {
  let component: AddPettyCashComponent;
  let fixture: ComponentFixture<AddPettyCashComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPettyCashComponent]
    });
    fixture = TestBed.createComponent(AddPettyCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
