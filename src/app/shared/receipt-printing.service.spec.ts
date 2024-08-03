import { TestBed } from '@angular/core/testing';

import { ReceiptPrintingService } from './receipt-printing.service';

describe('ReceiptPrintingService', () => {
  let service: ReceiptPrintingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceiptPrintingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
