import { TestBed } from '@angular/core/testing';

import { OrderCommunicationService } from './order-communication.service';

describe('OrderCommunicationService', () => {
  let service: OrderCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
