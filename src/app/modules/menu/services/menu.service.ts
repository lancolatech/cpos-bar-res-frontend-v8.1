import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { posOrder } from '../interfaces/order.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { OrganizationInterface } from 'src/app/shared/interfaces/organization.interface';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  apiUrl: string = '';
  savedOrg: OrganizationInterface | null = null;
  private inventoryEndpoint = `${environment.apiRootUrl}`;

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
  getCategories(): Observable<any> {
    const url = `${this.apiUrl}/categories`;
    return this.http.get(url);
  }
  getCategoriesProducts(id: string): Observable<any> {
    const url = `${this.apiUrl}/products/categories/${id}`;
    return this.http.get(url);
  }
  getFilteredCategories(query: string): Observable<any> {
    const url = `${this.apiUrl}/categories/search?query=${query}`;

    return this.http.get<any>(url);
  }
  addCategory(categoryData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/categories`,
      categoryData,
      httpOptions
    );
  }
  getCategoryProducts(categoryId: number): Observable<any> {
    const url = `${this.apiUrl}/categories/${categoryId}/products`;
    return this.http.get<any>(url);
  }

  getProductFromCategory(
    categoryId: number,
    productId: number
  ): Observable<any> {
    const url = `${this.apiUrl}/categories/${categoryId}/products/${productId}`;
    return this.http.get(url).pipe(
      map((response: any) => {
        if (response && Array.isArray(response.products)) {
          // If the response has an array of products
          return response.products.find(
            (product: any) => product.id === productId
          );
        } else if (response) {
          // If the response is a single product
          return response;
        } else {
          // Handle other cases or return an appropriate value
          return null;
        }
      }),
      catchError((error: any) => {
        console.error('Error retrieving product:', error);
        return throwError(error);
      })
    );
  }

  updateCategory(id: string, categoryData: any): Observable<any> {
    const url = `${this.apiUrl}/categories/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.put(url, categoryData, httpOptions).pipe(
      catchError((error: any) => {
        // Handle error (log, display message, etc.)
        return throwError(error);
      })
    );
  }

  deleteCategory(id: string): Observable<any> {
    const updatedCategoryData = {
      deleted: true, // Assuming 'deleted' is the field that represents the soft delete state
      // Other fields could be added based on your requirements
    };

    return this.http.put(
      `${this.apiUrl}/categories/${id}`,
      updatedCategoryData
    );
  }

  updateProduct(productId: string, productData: any): Observable<any> {
    const url = `${this.apiUrl}/products/${productId}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.http.put(url, productData, httpOptions).pipe(
      catchError((error: any) => {
        // Handle error (log, display message, etc.)
        return throwError(error);
      })
    );
  }

  deleteproduct(id: string): Observable<any> {
    const updatedProductData = {
      deleted: true, // Assuming 'deleted' is the field that represents the soft delete state
      // Other fields could be added based on your requirements
    };

    return this.http.delete(`${this.apiUrl}/products/${id}`);
  }

  getAllUsers(token: string): Observable<any> {
    return this.http.post(
      environment.apiRootUrl,
      {
        _org_code: 'nbdem',
        _jwttoken: token,
        _cloud_function_run: 'point_of_sale',
        _get_pos_products_list: 1,
      },
      httpOptions
    );
  }

  placeOrder(token: string, order: posOrder): Observable<any> {
    const orderData = {
      _submit_pos_data_cache: [order],
      _cloud_function_run: 'point_of_sale',
      _org_code: 'nbdem',
      _jwttoken: token,
    };
    return this.http.post(environment.apiRootUrl, orderData, httpOptions);
  }
  postSelectedItemsToBackend(
    selectedItems: any[],
    total: number,
    tableName: string
  ) {
    const orderData = {
      TableName: tableName,
      OrderNo: '1',
      Items: selectedItems,
      Total: total,
    };

    return this.http.post(` ${this.apiUrl}/orders`, orderData);
  }

  getPostedOrders(): Observable<any> {
    const url = ` ${this.apiUrl}/orders`;

    return this.http.get<any>(url);
  }
  getPostedOrdersDeleted(): Observable<any> {
    const url = ` ${this.apiUrl}/orders/deleted`;

    return this.http.get<any>(url);
  }
  getAllPostedOrdersForShift(id: string): Observable<any> {
    const url = ` ${this.apiUrl}/orders/allOrder/${id}`;

    return this.http.get<any>(url);
  }
  getIncompletePostedOrdersForShift(shiftId: string): Observable<any> {
    const url = ` ${this.apiUrl}/orders/incompleteOrders/${shiftId}`;

    return this.http.get<any>(url);
  }
  getIncompletePostedOrdersForClosedShifts(): Observable<any> {
    const url = ` ${this.apiUrl}/orders/previous-shift/incomplete`;

    return this.http.get<any>(url);
  }
  getPostedOrdersForAShift(id: string): Observable<any> {
    const url = ` ${this.apiUrl}/orders/report/${id}`;

    return this.http.get<any>(url);
  }
  getCreditSalesForAShift(id: string): Observable<any> {
    const url = ` ${this.apiUrl}/credit-sales/report/${id}`;

    return this.http.get<any>(url);
  }
  getAllUnpaidCreditSales(): Observable<any> {
    const url = ` ${this.apiUrl}/credit-sales`;

    return this.http.get<any>(url);
  }
  getCreditSalesPaymentsForAShift(id: string): Observable<any> {
    const url = ` ${this.apiUrl}/credit-sales-payments/report/${id}`;

    return this.http.get<any>(url);
  }
  getPettyCashForAShift(id: string): Observable<any> {
    const url = ` ${this.apiUrl}/petty-cash/report/${id}`;

    return this.http.get<any>(url);
  }
  getAdvanceOrdersForAShift(id: string): Observable<any> {
    const url = ` ${this.apiUrl}/advance-orders/report/${id}`;

    return this.http.get<any>(url);
  }
  getPostedOrdersForSelectedTimeRange(start: Date, end: Date): Observable<any> {
    const url = `${this.apiUrl}/orders/report?start=${start}&end=${end}`;
    console.log('start data', start);
    console.log('end data', end);

    return this.http.get<any>(url);
  }
  getPostedAdvanceOrdersForSelectedTimeRange(
    start: Date,
    end: Date
  ): Observable<any> {
    const url = `${
      this.apiUrl
    }/advance-orders/report?start=${start.toISOString()}&end=${end.toISOString()}`;

    return this.http.get<any>(url);
  }
  getPostedCreditSalesForSelectedTimeRange(
    start: Date,
    end: Date
  ): Observable<any> {
    const url = `${
      this.apiUrl
    }/credit-sales/report?start=${start.toISOString()}&end=${end.toISOString()}`;

    return this.http.get<any>(url);
  }
  getPostedPettyCashForSelectedTimeRange(
    start: Date,
    end: Date
  ): Observable<any> {
    const url = `${
      this.apiUrl
    }/petty-cash/report?start=${start.toISOString()}&end=${end.toISOString()}`;

    return this.http.get<any>(url);
  }

  getVoidedOrders(): Observable<any> {
    const url = ` ${this.apiUrl}/orders/deleted`;

    return this.http.get<any>(url);
  }
  getOrderDetailsById(orderId: string): Observable<any> {
    const url = ` ${this.apiUrl}/orders/${orderId}`;
    return this.http.get(url);
  }

  // deleteOrder(orderId: number): Observable<void> {
  //   const url = ` ${this.apiUrl}/orders/${orderId}`;
  //   return this.http.delete<void>(url);
  // }
  updateOrder(orderId: number, orderData: any): Observable<any> {
    const url = ` ${this.apiUrl}/orders/${orderId}`;
    console.log('Data being updated:', orderData);
    return this.http.put(url, orderData, httpOptions);
  }
  createUpdateOrders(orderData: any): Observable<any> {
    const url = ` ${this.apiUrl}/orders/updateOrder`;
    console.log('Data being updated:', orderData);
    return this.http.post(url, orderData);
  }
  deleteOrder(orderId: string): Observable<void> {
    const url = ` ${this.apiUrl}/orders/${orderId}`;
    return this.http.delete<void>(url);
  }
  confirmeleteOrder(orderId: string): Observable<void> {
    const url = ` ${this.apiUrl}/orders/confirm/${orderId}`;
    return this.http.delete<void>(url);
  }
  declineDeleteOrder(orderId: string): Observable<void> {
    const url = ` ${this.apiUrl}/orders/decline/${orderId}`;
    return this.http.delete<void>(url);
  }

  getCategoryProductCount(categoryId: number): Observable<number> {
    const url = `${this.apiUrl}/categories/${categoryId}/products`; // Adjust the URL based on your Laravel routes
    return this.http.get<number>(url);
  }

  getCategoryWithProducts(categoryId: number): Observable<any> {
    const url = `${this.apiUrl}/categories/${categoryId}/products`;

    return this.http.get<any>(url);
  }

  postToInventory(updatedProduct: any): Observable<any> {
    return this.http.post(
      `${this.inventoryEndpoint}/inventory`,
      updatedProduct
    );
  }
  getInventory(): Observable<any> {
    const url = `${this.inventoryEndpoint}/inventory`;

    return this.http.get<any>(url);
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
  createProducts(productData: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/products`;
    return this.http.post<any>(apiUrl, productData);
  }
  getAllProducts(): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/products`;
    return this.http.get(apiUrl);
  }
  postOrderToDb(OrderData: any): Observable<any> {
    const apiUrl: string = `${this.apiUrl}/orders`;
    return this.http.post<any>(apiUrl, OrderData);
  }
}
