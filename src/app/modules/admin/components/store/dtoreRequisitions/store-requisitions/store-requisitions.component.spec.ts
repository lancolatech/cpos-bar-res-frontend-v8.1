import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreRequisitionsComponent } from './store-requisitions.component';

describe('StoreRequisitionsComponent', () => {
  let component: StoreRequisitionsComponent;
  let fixture: ComponentFixture<StoreRequisitionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreRequisitionsComponent]
    });
    fixture = TestBed.createComponent(StoreRequisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
