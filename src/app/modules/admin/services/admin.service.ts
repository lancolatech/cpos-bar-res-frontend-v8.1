import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from 'src/app/functions/local-storage.functions';
import {
  OrgOptionsInterface,
  OrganizationInterface,
} from 'src/app/shared/interfaces/organization.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { environment } from 'src/environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  // private apiUrl = `${environment.apiRootUrl}/users`;
  apiUrl: string = '';
  savedOrg: OrganizationInterface | null = null;

  orgOptions$ = new BehaviorSubject<OrgOptionsInterface | null>(
    getFromLocalStorage('orgOptions')
  );

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
      console.error('companyInfo is invalid or does not have an id property');
      return;
    }

    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg.id}`;
    // console.log('api url link', this.apiUrl);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  addCategory(categoryData: any): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/categories', categoryData);
  }

  updateConfirmDeleteTo1(orderId: number): Observable<any> {
    const url = `${this.apiUrl}/orders/${orderId}`;
    const updateData = { confirm_delete: 1 }; // Data to send for updating confirm_delete to 1

    return this.http.put(url, updateData);
  }
  declineDelete(orderId: number): Observable<any> {
    const url = `${this.apiUrl}/orders/${orderId}`;
    const updateData = { deleted: 0 }; // Data to send for updating confirm_delete to 1

    return this.http.put(url, updateData);
  }

  createCustomer(customerDetails: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/customers`;
    return this.http.post<any>(apiUrl, customerDetails);
  }

  getAllCustomers(): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/customers`;

    return this.http.get(apiUrl);
  }
  getAllOnCreditCustomers(): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/customers/dueCredit/greaterThanZero`;

    return this.http.get(apiUrl);
  }

  getCustomerById(id: any): Observable<any> {
    // Assuming the API endpoint to fetch order details by ID
    const url = `${this.apiUrl}/customers/${id}`;
    return this.http.get<any>(url);
  }

  createPettyCash(PettyCash: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/petty-cash`;
    return this.http.post<any>(apiUrl, PettyCash);
  }

  getAllPettyCash(): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/petty-cash`;

    return this.http.get(apiUrl);
  }
  getAllPettyCashForSelectedShift(id: string): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/petty-cash/report/${id}`;

    return this.http.get(apiUrl);
  }

  createTakeOutOrg(org: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/take-out-organizations`;
    return this.http.post<any>(apiUrl, org);
  }

  getAllTakeOutOrg(): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/take-out-organizations`;

    return this.http.get(apiUrl);
  }

  createTakeOutOrgAwards(award: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/take-out-awards`;
    return this.http.post<any>(apiUrl, award);
  }
  getAllTakeOutOrgAwars(): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/take-out-awards`;

    return this.http.get(apiUrl);
  }

  getAllTakeOutOrgAwarsById(id: any): Observable<any> {
    const url = `${this.apiUrl}/take-out-awards/${id}`;
    return this.http.get<any>(url);
  }

  createTakeOutOrgSales(sales: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/take-out-sales`;
    return this.http.post<any>(apiUrl, sales);
  }
  getAllTakeOutSales(): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/take-out-sales`;

    return this.http.get(apiUrl);
  }
  getAllTakeOutSalesOpen(): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/take-out-sales/open`;

    return this.http.get(apiUrl);
  }
  getTakeOutSalesById(id: any): Observable<any> {
    const url = `${this.apiUrl}/take-out-sales/${id}`;
    return this.http.get<any>(url);
  }
  updateTakeOutSales(orderId: any, updateData: any): Observable<any> {
    const url = `${this.apiUrl}/take-out-sales/${orderId}`;
    return this.http.put(url, updateData);
  }
  deleteTakeOutSales(orderId: string): Observable<any> {
    const url = `${this.apiUrl}/take-out-sales/${orderId}`;
    return this.http.delete(url);
  }
  createRecipe(sales: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/recipe`;
    return this.http.post<any>(apiUrl, sales);
  }
  getAllRecipe(): Observable<any> {
    const url = `${this.apiUrl}/recipe`;
    return this.http.get<any>(url);
  }
  getAllIncredientsRequests(): Observable<any> {
    const url = `${this.apiUrl}/recipe/ingredient-requests`;
    return this.http.get<any>(url);
  }
  getAllIncredientsRequestsForAShift(id: string): Observable<any> {
    const url = `${this.apiUrl}/recipe/ingredient-requests/shift/${id}`;
    return this.http.get<any>(url);
  }
  checkIngredientAvailability(
    recipeId: string,
    quantity: number
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/recipe/check-availability`, {
      recipeId,
      quantity,
    });
  }
  requestIngredients(
    recipeId: string,
    quantity: number,
    shiftId: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/recipe/ingredient-requests`, {
      recipeId,
      quantity,
      shiftId,
    });
  }

  recordProduction(
    requestId: string,
    producedQuantity: number,
    shiftId: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/recipe/production-records`, {
      requestId,
      producedQuantity,
      shiftId,
    });
  }
  getShifts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recipe/shifts`);
  }

  getReportForShift(shiftId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recipe/report/shift/${shiftId}`);
  }

  getReportForDateRange(startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recipe/report/date-range`, {
      params: { startDate, endDate },
    });
  }
  addIngredient(sales: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/ingredients`;
    return this.http.post<any>(apiUrl, sales);
  }

  getIngredient(): Observable<any> {
    const url = `${this.apiUrl}/ingredients`;
    return this.http.get<any>(url);
  }

  updateIncredients(id: number, updateData: any): Observable<any> {
    const url = `${this.apiUrl}/ingredients/${id}`;
    return this.http.put(url, updateData);
  }

  createRooms(rooms: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/rooms`;
    return this.http.post<any>(apiUrl, rooms);
  }
  getRooms(): Observable<any> {
    const url = `${this.apiUrl}/rooms`;
    return this.http.get<any>(url);
  }
  updateRooms(orderId: number, updateData: any): Observable<any> {
    const url = `${this.apiUrl}/rooms/${orderId}`;
    return this.http.put(url, updateData);
  }
  createRoomsBooking(bookings: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/room-bookings`;
    return this.http.post<any>(apiUrl, bookings);
  }
  updateRoomsBooking(orderId: number, updateData: any): Observable<any> {
    const url = `${this.apiUrl}/room-bookings/${orderId}`;
    return this.http.put(url, updateData);
  }
  getRoomsBookings(): Observable<any> {
    const url = `${this.apiUrl}/room-bookings`;
    return this.http.get<any>(url);
  }
  createRoomsSales(sales: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/room-sales`;
    return this.http.post<any>(apiUrl, sales);
  }
  getRoomsSales(): Observable<any> {
    const url = `${this.apiUrl}/room-sales`;
    return this.http.get<any>(url);
  }
  updateRoomsSales(orderId: number, updateData: any): Observable<any> {
    const url = `${this.apiUrl}/room-sales/${orderId}`;
    return this.http.put(url, updateData);
  }
  deleteOrder(saleId: number): Observable<void> {
    const url = ` ${this.apiUrl}/room-sales/${saleId}`;
    return this.http.delete<void>(url);
  }

  // getOrgOptions(org: OrganizationInterface | null) {
  getOrgOptions() {
    this.fetchOrganizationInfo();

    // get org options from local storage
    const ogOptions = getFromLocalStorage(
      'orgOptions'
    ) as OrgOptionsInterface | null;
    // console.log('ogOptions', ogOptions);
    if (ogOptions) {
      this.orgOptions$.next(ogOptions);
      // return;
    }

    // if (!org) throw new Error('org is required');

    const url = `${this.apiUrl}/options`;

    // get from api
    this.http
      .get<any>(url)
      .pipe(take(1))
      .subscribe({
        next: (options) => {
          const option = options[0] || null;
          // console.log('ogOptions', option);

          this.orgOptions$.next(option);
          saveToLocalStorage('orgOptions', option);
        },
        error: (error) => {
          console.log('error');
          console.log(error);
        },
      });
  }

  createSuppliers(suppliers: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/suppliers`;
    return this.http.post<any>(apiUrl, suppliers);
  }
  getSuppliers(): Observable<any> {
    const url = `${this.apiUrl}/suppliers`;
    return this.http.get<any>(url);
  }
  updateSuppliers(id: number, updateData: any): Observable<any> {
    const url = `${this.apiUrl}/suppliers/${id}`;
    return this.http.put(url, updateData);
  }

  deleteSurplier(suppliers: number): Observable<void> {
    const url = ` ${this.apiUrl}/suppliers/${suppliers}`;
    return this.http.delete<void>(url);
  }
  addPurchase(purchase: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/purchases`;
    return this.http.post<any>(apiUrl, purchase);
  }

  getPurchase(): Observable<any> {
    const url = `${this.apiUrl}/purchases`;
    return this.http.get<any>(url);
  }
  gettPurchaseOrdersForAShift(id: string): Observable<any> {
    const url = ` ${this.apiUrl}/purchases/report/${id}`;

    return this.http.get<any>(url);
  }
  gettPurchaseOrdersForSelectedTimeRange(
    start: Date,
    end: Date
  ): Observable<any> {
    const url = `${this.apiUrl}/purchases/report?start=${start}&end=${end}`;

    return this.http.get<any>(url);
  }
  getStockTransferOrdersForAShift(id: string): Observable<any> {
    const url = ` ${this.apiUrl}/inventory-movements/report/${id}`;

    return this.http.get<any>(url);
  }
  getStockTransfeOrdersForSelectedTimeRange(
    start: Date,
    end: Date
  ): Observable<any> {
    const url = `${this.apiUrl}/inventory-movements/report?start=${start}&end=${end}`;

    return this.http.get<any>(url);
  }

  createStockTransfer(stock: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/inventory-movements`;
    return this.http.post<any>(apiUrl, stock);
  }
  getStockTransfer(): Observable<any> {
    const url = `${this.apiUrl}/inventory-movements`;
    return this.http.get<any>(url);
  }
}
