import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Shift } from '../../menu/interfaces/Shift';
import { environment } from 'src/environments/environment';
import { MenuService } from '../../menu/services/menu.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { HotToastService } from '@ngneat/hot-toast';
import { OrganizationInterface } from 'src/app/shared/interfaces/organization.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  apiUrl: string = '';
  savedOrg: OrganizationInterface | null = null;
  private currentShift: Shift | null = null;
  private shiftSource = new BehaviorSubject<Shift | null>(this.currentShift);
  currentShift$ = this.shiftSource.asObservable();

  constructor(
    private http: HttpClient,
    private menuService: MenuService,
    private notificationService: HotToastService,
    private localStorageService: LocalStorageService
  ) {
    this.fetchOrganizationInfo();
    this.checkForOpenShift();
    this.loadShiftFromLocalStorage(); // Load shift from local storage on service initialization
  }
  private fetchOrganizationInfo() {
    const companyInfoString = this.localStorageService.getItem('companyInfo');
    this.savedOrg = companyInfoString ? JSON.parse(companyInfoString) : null;
    // console.log('company Infor', this.savedOrg);

    if (!this.savedOrg || !this.savedOrg.id) {
      console.error('companyInfo is invalid or does not have an id property');
      return;
    }

    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg.id}/shifts`;
    // console.log('api url link', this.apiUrl);
  }

  getAllShifts(): Observable<Shift[]> {
    return this.http.get<Shift[]>(this.apiUrl);
  }

  getShiftById(shiftId: number): Observable<Shift> {
    const url = `${this.apiUrl}/${shiftId}`;
    return this.http.get<Shift>(url);
  }

  private checkForOpenShift(): void {
    // Check local storage for an existing shift
    // const storedShift = localStorage.getItem('currentShift');
    // if (storedShift) {
    //   this.currentShift = JSON.parse(storedShift);
    //   this.shiftSource.next(this.currentShift);
    // } else {

    // }
    // If no shift in local storage, check the database for an open shift
    this.http.get<Shift>(`${this.apiUrl}/open`).subscribe((shifts: Shift) => {
      const openShift = shifts; // Assuming TimeEnded is null or empty for open shifts
      if (openShift) {
        this.currentShift = openShift;
        this.shiftSource.next(this.currentShift);
        localStorage.setItem('currentShift', JSON.stringify(this.currentShift));
      }
    });
  }

  private loadShiftFromLocalStorage(): void {
    const storedShift = localStorage.getItem('currentShift');
    if (storedShift) {
      this.currentShift = JSON.parse(storedShift);
      this.shiftSource.next(this.currentShift);
    }
  }

  startShift(shiftData: any): Observable<Shift> {
    // Send a request to your Laravel API route for starting a shift
    return this.http.post<Shift>(`${this.apiUrl}/start`, shiftData).pipe(
      tap((response: Shift) => {
        this.currentShift = response; // Ensure response.id is assigned to id
        this.shiftSource.next(this.currentShift);

        // Store the shift in local storage
        localStorage.setItem('currentShift', JSON.stringify(this.currentShift));
      })
    );
  }
  startShiftOnLogin(): Observable<Shift> {
    // Send a request to your Laravel API route for starting a shift
    return this.http.post<Shift>(`${this.apiUrl}/startOnLogin`, null).pipe(
      tap((response: Shift) => {
        this.currentShift = response; // Ensure response.id is assigned to id
        this.shiftSource.next(this.currentShift);

        // Store the shift in local storage
        localStorage.setItem('currentShift', JSON.stringify(this.currentShift));
      })
    );
  }

  createShift(shiftData: any): Observable<Shift> {
    // Send a request to your Laravel API route for creating a new shift
    return this.http.post<Shift>(`${this.apiUrl}/start`, shiftData);
  }

  endShift(data: any): Observable<void> {
    if (!this.currentShift) {
      return of(); // No shift to end
    }

    const id = this.currentShift.id; // Retrieve shift's ID from currentShift

    // Check if there are incomplete orders for the current shift
    return this.menuService.getPostedOrders().pipe(
      switchMap((orders: any[]) => {
        const incompleteOrders = orders.filter(
          (order) =>
            order.ShiftID === id && !order.Is_complete && order.deleted === 0
        );

        if (incompleteOrders.length > 0) {
          this.notificationService.error(
            'Close all orders first before ending the shift.'
          );
          return of(); // Return an observable with no value
        } else {
          // Send a request to your Laravel API route for ending a shift
          return this.http.post(`${this.apiUrl}/end/${id}`, data).pipe(
            switchMap(() => {
              this.currentShift = null;
              this.shiftSource.next(this.currentShift);
              this.notificationService.success('Shift Ended');

              localStorage.removeItem('currentShift'); // Clear the shift from local storage
              return of(); // Return an observable with no value
            }),
            catchError((error) => {
              // Handle any errors that occurred during the HTTP request
              console.error('Error ending shift:', error);
              return of(); // Return an observable with no value
            })
          );
        }
      }),
      catchError((error) => {
        // Handle any errors that occurred during the menuService.getPostedOrders() call
        console.error('Error getting posted orders:', error);
        return of(); // Return an observable with no value
      })
    );
  }
}
