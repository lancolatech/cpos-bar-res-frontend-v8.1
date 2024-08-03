// order-details-resolver.service.ts

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { OrderDetailsService } from './order-details-service.service';

@Injectable({
  providedIn: 'root'
})
export class OrderDetailsResolver implements Resolve<any> {
  constructor(private orderDetailsService: OrderDetailsService) {} // Replace with your actual service

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    // Use your service to fetch order details
    return this.orderDetailsService.getOrderDetails(route.params['id']).pipe(
      catchError(error => {
        console.error('Error fetching order details:', error);
        // Handle error appropriately (e.g., navigate to an error page)
        return of(null);
      })
    );
  }
}
