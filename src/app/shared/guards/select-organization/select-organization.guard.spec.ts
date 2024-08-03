import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { selectOrganizationGuard } from './select-organization.guard';

describe('selectOrganizationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => selectOrganizationGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
