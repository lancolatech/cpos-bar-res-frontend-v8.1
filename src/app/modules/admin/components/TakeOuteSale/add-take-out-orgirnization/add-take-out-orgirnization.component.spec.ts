import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTakeOutOrgirnizationComponent } from './add-take-out-orgirnization.component';

describe('AddTakeOutOrgirnizationComponent', () => {
  let component: AddTakeOutOrgirnizationComponent;
  let fixture: ComponentFixture<AddTakeOutOrgirnizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTakeOutOrgirnizationComponent]
    });
    fixture = TestBed.createComponent(AddTakeOutOrgirnizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
