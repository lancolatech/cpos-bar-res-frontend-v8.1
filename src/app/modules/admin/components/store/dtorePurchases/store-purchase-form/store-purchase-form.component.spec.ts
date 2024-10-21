import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorePurchaseFormComponent } from './store-purchase-form.component';

describe('StorePurchaseFormComponent', () => {
  let component: StorePurchaseFormComponent;
  let fixture: ComponentFixture<StorePurchaseFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StorePurchaseFormComponent]
    });
    fixture = TestBed.createComponent(StorePurchaseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
