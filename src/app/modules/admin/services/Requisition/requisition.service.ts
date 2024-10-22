import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { RequisitionInterface, RequisitionItem } from 'src/app/shared/interfaces/requisition.interface';

@Injectable({
  providedIn: 'root'
})
export class RequisitionService {
  private apiUrl: string;
  savedOrg: string | null;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.savedOrg = this.localStorageService.getSavedOrgId();
    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg}/requisitions`;
  }

  addRequisition(
    requisition: RequisitionInterface
  ): Observable<RequisitionInterface> {
    const url = `${this.apiUrl}`;
    return this.http.post<RequisitionInterface>(url, requisition);
  }

  getAllRequisitions(): Observable<RequisitionInterface[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<RequisitionInterface[]>(url);
  }

  getRequisitionbyId(id: string): Observable<RequisitionInterface> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<RequisitionInterface>(url);
  }

  updateRequisition(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
  approveRequisition(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/approve`, data);
  }

  deleteRequisition(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}
