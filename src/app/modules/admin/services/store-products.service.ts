import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrganizationInterface } from 'src/app/shared/interfaces/organization.interface';
import { storeProduct } from 'src/app/shared/interfaces/storeProduct.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoreProductsService {
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
      console.error('companyInfo is invalid or does not have an id property');
      return;
    }

    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg.id}/store`;
    // console.log('api url link', this.apiUrl);
  }

  addStoreProduct(storeProduct: storeProduct): Observable<storeProduct> {
    const url = `${this.apiUrl}`;
    return this.http.post<storeProduct>(url, storeProduct);
  }

  getAllStoreProducts(): Observable<storeProduct[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<storeProduct[]>(url);
  }

  getStoreProductbyId(id: string): Observable<storeProduct> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<storeProduct>(url);
  }

  updateStoreProduct(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteStoreProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
