import { TestBed } from '@angular/core/testing';

import { StorePurchasesService } from './store-purchases.service';

describe('StorePurchasesService', () => {
  let service: StorePurchasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorePurchasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
