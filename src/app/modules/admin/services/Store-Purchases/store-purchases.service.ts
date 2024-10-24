import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { StorePurchaseItem, StorePurchase } from 'src/app/shared/interfaces/store-purchase.interface';

@Injectable({
  providedIn: 'root'
})

export class StorePurchasesService {

  private apiUrl: string;
  savedOrg: string | null;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.savedOrg = this.localStorageService.getSavedOrgId();
    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg}/store-purchases`;
  }

  createPurchase(purchase: StorePurchase): Observable<StorePurchase> {
    return this.http.post<StorePurchase>(this.apiUrl, purchase);
  }

  getAllPurchases(): Observable<StorePurchase[]> {
    return this.http.get<StorePurchase[]>(this.apiUrl);
  }

  getPurchasesByDateRange(
    startDate: string,
    endDate: string
  ): Observable<StorePurchase[]> {
    const url = `${this.apiUrl}/by-date-range`;
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<StorePurchase[]>(url, { params });
  }

  getPurchaseById(purchaseId: string): Observable<StorePurchase> {
    return this.http.get<StorePurchase>(`${this.apiUrl}/${purchaseId}`);
  }

  updatePurchase(
    purchaseId: string,
    purchase: Partial<StorePurchase>
  ): Observable<StorePurchase> {
    return this.http.put<StorePurchase>(
      `${this.apiUrl}/${purchaseId}`,
      purchase
    );
  }

  deletePurchase(purchaseId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${purchaseId}`);
  }
}
