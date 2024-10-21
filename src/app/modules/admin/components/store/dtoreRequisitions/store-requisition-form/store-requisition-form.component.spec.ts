import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreRequisitionFormComponent } from './store-requisition-form.component';

describe('StoreRequisitionFormComponent', () => {
  let component: StoreRequisitionFormComponent;
  let fixture: ComponentFixture<StoreRequisitionFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreRequisitionFormComponent]
    });
    fixture = TestBed.createComponent(StoreRequisitionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
