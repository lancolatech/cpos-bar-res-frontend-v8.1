import { TestBed } from '@angular/core/testing';

import { StoreCategoriesService } from './store-categories.service';

describe('StoreCategoriesService', () => {
  let service: StoreCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
