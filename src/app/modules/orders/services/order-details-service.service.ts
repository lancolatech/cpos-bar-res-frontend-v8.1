// order-details.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsService {
  constructor(private http: HttpClient) {}

  getOrderDetails(orderId: string): Observable<any> {
    // Implement your logic to fetch order details using HTTP
    return this.http.get(`${environment.apiRootUrl}/orders/${orderId}`);
  }
}
