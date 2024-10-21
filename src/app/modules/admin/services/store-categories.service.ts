import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrganizationInterface } from 'src/app/shared/interfaces/organization.interface';
import { storeCategory } from 'src/app/shared/interfaces/storecategory.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StoreCategoriesService {
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

    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg.id}/store-categories`;
    // console.log('api url link', this.apiUrl);
  }

  getAllStoreCategories(): Observable<storeCategory[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<storeCategory[]>(url);
  }

  addStoreCategory(storeCategory: storeCategory): Observable<storeCategory> {
    const url = `${this.apiUrl}`;
    return this.http.post<storeCategory>(url, storeCategory);
  }

  getStoreCategorybyId(id: string): Observable<storeCategory> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<storeCategory>(url);
  }

  updateStoreCategory(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteStoreCategory(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
