import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { NotificationService } from '../notification/notification.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { OrganizationInterface } from '../../interfaces/organization.interface';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {
  organization$ = new BehaviorSubject<OrganizationInterface | null>(
    this.localStorageService.getItem('companyInfo')
  );
  private apiUrl: string;
  savedOrgId: OrganizationInterface | null;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService,
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    const savedOrganization = this.localStorageService.getItem(
      'companyInfo',
      true
    ) as OrganizationInterface;
    this.organization$.next(savedOrganization);
    this.savedOrgId =
      this.localStorageService.getSavedOrgId() as OrganizationInterface | null;
    const orId = this.savedOrgId?.id;
    this.apiUrl = `${environment.apiRootUrl}/organizations/${orId}/auth`;
  }

  getOrganizationName() {
    this.httpClient
      .get(`${environment.apiRootUrl}/organizations`)
      .pipe(take(1))
      .subscribe({
        next: (data: any) => {
          console.group(data);
        },
        error: (err) => {},
      });
  }

  // getOrganization(org: string): Observable<boolean> {
  //   const organizationId = org.toString();
  //   return new Observable<boolean>((subscriber) => {
  //     let result = false;
  //     let companyInfo: OrganizationInterface | null = null;

  //     this.httpClient
  //       .get(
  //         `https://cpos-bar-res-backend.vercel.app/organizations/select/${organizationId}`
  //       )
  //       .pipe(take(1))
  //       .subscribe({
  //         next: (data: any) => {
  //           if (data) {
  //             companyInfo = data as OrganizationInterface;
  //             result = true;
  //           } else {
  //             this.notificationService.showError('Organization not found');
  //             // this.authService.logout(true);
  //           }

  //           const orgCode = data.orgCode || null;
  //           this.localStorageService.setItem('organization', orgCode);
  //           this.localStorageService.setLocalItem('companyInfo', companyInfo);

  //           this.organization$.next(companyInfo);
  //           subscriber.next(result);
  //         },
  //         error: (err) => {
  //           console.log(err);

  //           subscriber.next(false);
  //         },
  //       });
  //   });
  // }

  async getOrganizationByOrgCode(
    orgCode: string
  ): Promise<OrganizationInterface | null> {
    const url = `${environment.apiRootUrl}/organizations/select/${orgCode}`;
    return new Promise<OrganizationInterface | null>((resolve, reject) => {
      this.http
        .get(url)
        .pipe(take(1))
        .subscribe((data) => {
          const organization = data as OrganizationInterface | null;
          this.organization$.next(organization);
          resolve(organization || null);
        });
    });
    // const organization: OrganizationInterface = await this.http.get<OrganizationInterface>(url);
    // this.organization$
  }

  unSelectOrganization() {
    this.organization$.next(null);
    this.localStorageService.clear();
  }

  checkTokenValidity() {
    const user = this.localStorageService.getItem('user');

    this.httpClient
      .get(`${environment.apiRootUrl}/verify-token`)
      .pipe(take(1))
      .subscribe({
        next: (data) => {},
        error: (err) => {
          this.authService.logout(true);
          // this.notificationService.showError({ title: 'Error', message: 'Session expired, please log in again' });
        },
      });
  }
}
