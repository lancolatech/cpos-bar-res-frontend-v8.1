import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Inventory } from 'src/app/shared/interfaces/inventory.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  private apiUrl: string;
  savedOrg: string | null;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.savedOrg = this.localStorageService.getSavedOrgId();
    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg}/inventory`;
  }

  getAllInventorys(): Observable<Inventory[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<Inventory[]>(url);
  }
  getSupplierUnpaidPurchase(id: string): Observable<any> {
    const url = `${this.apiUrl}/unpaid/${id}`;
    return this.http.get<any[]>(url);
  }
  getInventoryReportForDay(date: Date | string): Observable<Inventory[]> {
    const url = `${this.apiUrl}/report/day`;
    let formattedDate: string;

    if (date instanceof Date) {
      formattedDate = date.toISOString().split('T')[0];
    } else {
      // Assuming the string is already in 'YYYY-MM-DD' format
      formattedDate = date;
    }

    const params = new HttpParams().set('date', formattedDate);
    return this.http.get<Inventory[]>(url, { params });
  }

  getInventoryReportForTimeRange(
    startDate: Date,
    endDate: Date
  ): Observable<Inventory[]> {
    const url = `${this.apiUrl}/report/range`;
    const params = new HttpParams()
      .set('startDate', startDate.toISOString().split('T')[0])
      .set('endDate', endDate.toISOString().split('T')[0]);
    return this.http.get<Inventory[]>(url, { params });
  }

  addInventory(inventory: any): Observable<any> {
    const url = `${this.apiUrl}`;
    return this.http.post<any>(url, inventory);
  }

  getInventorybyId(id: string): Observable<Inventory> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Inventory>(url);
  }

  updateInventory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteInventory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
