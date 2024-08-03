// order-communication.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderCommunicationService {
  private orderIdSource = new BehaviorSubject<number>(0);
  currentOrderId = this.orderIdSource.asObservable();

  constructor() {}

  updateOrderId(orderId: number) {
    this.orderIdSource.next(orderId);
  }

  getOrderId(): number {
    return this.orderIdSource.value;
  }
}
