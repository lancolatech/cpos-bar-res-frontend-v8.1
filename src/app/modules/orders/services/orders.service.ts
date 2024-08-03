import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Orders } from '../../menu/interfaces/Orders';
import { OrganizationInterface } from 'src/app/shared/interfaces/organization.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  apiUrl: string = '';
  savedOrg: OrganizationInterface | null = null;
  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.fetchOrganizationInfo();
  }
  private fetchOrganizationInfo() {
    const companyInfoString = this.localStorageService.getItem('companyInfo');
    this.savedOrg = companyInfoString ? JSON.parse(companyInfoString) : null;
    // console.log('company Infor', this.savedOrg);

    if (!this.savedOrg || !this.savedOrg.id) {
      // console.error('companyInfo is invalid or does not have an id property');
      return;
    }

    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg.id}`;
    // console.log('api url link', this.apiUrl);
  }

  // method to submit payment
  submitPayment() {}

  private selectedOrderSource = new BehaviorSubject<Orders | null>(null);
  selectedOrder$ = this.selectedOrderSource.asObservable();

  setSelectedOrder(order: Orders): void {
    this.selectedOrderSource.next(order);
  }

  getOrderById(orderId: any): Observable<any> {
    // Assuming the API endpoint to fetch order details by ID
    const url = `${this.apiUrl}/orders/${orderId}`;
    return this.http.get<any>(url);
  }
  rePrintOrder(orderId: any): Observable<any> {
    // Assuming the API endpoint to fetch order details by ID
    const url = `${this.apiUrl}/orders/reprint/${orderId}`;
    return this.http.put<any>(url, null);
  }
  getAdvanceOrders(): Observable<any> {
    // Assuming the API endpoint to fetch order details by ID
    const url = `${this.apiUrl}/advanced-orders`;
    return this.http.get<any>(url);
  }
  getAdvancedOrderById(orderId: any): Observable<any> {
    // Assuming the API endpoint to fetch order details by ID
    const url = `${this.apiUrl}/advanced-orders/${orderId}`;
    return this.http.get<any>(url);
  }

  updateAmountPaid(orderId: any, amountPaid: any) {
    return this.http.put(`${this.apiUrl}/orders/${orderId}`, {
      amountPaid,
    });
  }
  updateAdvancedAmountPaid(orderId: any, amountPaid: any) {
    return this.http.put(`${this.apiUrl}/advanced-orders/${orderId}`, {
      amountPaid,
    });
  }

  updateAdvacedOrder(orderId: number, orderData: any): Observable<any> {
    const url = ` ${this.apiUrl}/advanced-orders/${orderId}`;
    console.log('Data being updated:', orderData);
    return this.http.put(url, orderData, httpOptions);
  }
  deleteAdvancedOrder(orderId: number): Observable<void> {
    const url = ` ${this.apiUrl}/advanced-orders/${orderId}`;
    return this.http.delete<void>(url);
  }

  getAdvanceOrdersPayments(): Observable<any> {
    // Assuming the API endpoint to fetch order details by ID
    const url = `${this.apiUrl}/payments`;
    return this.http.get<any>(url);
  }
  getAdvancedOrderPaymentsById(orderId: any): Observable<any> {
    // Assuming the API endpoint to fetch order details by ID
    const url = `${this.apiUrl}/payments/${orderId}`;
    return this.http.get<any>(url);
  }

  createCreditSale(customerDetails: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/credit-sales`;
    return this.http.post<any>(apiUrl, customerDetails);
  }

  getAllCreditSales(): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/credit-sales`;

    return this.http.get(apiUrl);
  }
  getCreditSalesOrderById(orderId: any): Observable<any> {
    // Assuming the API endpoint to fetch order details by ID
    const url = `${this.apiUrl}/credit-sales/${orderId}`;
    return this.http.get<any>(url);
  }
  updateCreditSales(orderId: number, orderData: any): Observable<any> {
    const url = ` ${this.apiUrl}/credit-sales/${orderId}`;
    console.log('Data being updated:', orderData);
    return this.http.put(url, orderData, httpOptions);
  }

  createCreditSalePayments(creditSaleData: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/credit-sales-payments`;
    return this.http.post(apiUrl, creditSaleData);
  }

  getAllCreditSalesPayments(): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/credit-sales-payments`;

    return this.http.get(apiUrl);
  }
}
