import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreProductsFormComponent } from './store-products-form.component';

describe('StoreProductsFormComponent', () => {
  let component: StoreProductsFormComponent;
  let fixture: ComponentFixture<StoreProductsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreProductsFormComponent]
    });
    fixture = TestBed.createComponent(StoreProductsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
