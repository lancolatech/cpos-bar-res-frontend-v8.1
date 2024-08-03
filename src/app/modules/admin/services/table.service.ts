import { Injectable } from '@angular/core';
import { Table } from '../../menu/interfaces/Tables';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrganizationInterface } from 'src/app/shared/interfaces/organization.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TableService {
  apiUrl: string = '';
  savedOrg: OrganizationInterface | null = null;
  private selectedTable: Table | null = null;
  private selectedTableSource = new BehaviorSubject<Table | null>(
    this.selectedTable
  );
  selectedTable$ = this.selectedTableSource.asObservable();

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.fetchOrganizationInfo();
    // Check local storage for an existing selected table
    const storedTable = localStorage.getItem('selectedTable');
    if (storedTable) {
      this.selectedTable = JSON.parse(storedTable);
      this.selectedTableSource.next(this.selectedTable);
    }
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

  getTables(searchTerm?: string) {
    const searchQuery = searchTerm ? `?search=${searchTerm}` : '';
    return this.http.get<Table[]>(`${this.apiUrl}/tables${searchQuery}`);
  }

  setSelectedTable(table: Table) {
    this.selectedTable = table;
    this.selectedTableSource.next(this.selectedTable);

    // Store the selected table in local storage
    // localStorage.setItem('selectedTable', JSON.stringify(this.selectedTable));
  }

  getSelectedTable(): Table | null {
    return this.selectedTable;
  }

  clearSelectedTable() {
    this.selectedTable = null;
    this.selectedTableSource.next(this.selectedTable);

    // Remove the selected table from local storage
    // localStorage.removeItem('selectedTable');
  }

  markTableAsOccupied(tableId: number) {
    // Make a PUT request to mark the table as occupied using the provided endpoint
    return this.http.put(`${this.apiUrl}/tables/${tableId}/occupy`, null);
  }
  markTableAsFree(tableId: number) {
    // Make a PUT request to mark the table as free using the provided endpoint
    return this.http.put(`${this.apiUrl}/tables/${tableId}/vacate`, null);
  }
}
