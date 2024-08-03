import { TestBed } from '@angular/core/testing';

import { ProductIDService } from './product-id.service';

describe('ProductIDService', () => {
  let service: ProductIDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductIDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
