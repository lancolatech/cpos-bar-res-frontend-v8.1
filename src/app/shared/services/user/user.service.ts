import { NotificationService } from './../notification/notification.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterface } from '../../interfaces/auth.interface';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { HotToastService } from '@ngneat/hot-toast';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { OrganizationInterface } from '../../interfaces/organization.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = '';
  savedOrg: OrganizationInterface | null = null;
  allUsers$ = new BehaviorSubject<UserInterface[]>([]);

  constructor(
    private httpClient: HttpClient,
    private notificationService: HotToastService,
    private router: Router,
    private authService: AuthService,
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
  getAllUsers() {
    return new Promise<UserInterface[]>((resolve, reject) => {
      this.httpClient
        .get<UserInterface[]>(`${this.apiUrl}/auth`)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            this.allUsers$.next(data);
            resolve(data);
          },
          error: (err) => {},
        });
    });
  }
  getCurrentUser(): Observable<UserInterface | null> {
    return this.authService.getCurrentUser();
  }

  registerUser(user: Partial<UserInterface>) {
    return new Promise<boolean>((resolve, reject) => {
      this.httpClient
        .post(`${this.apiUrl}/auth/signup`, user)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            if (data) {
              if (data.message === 'success') {
                this.getAllUsers();
                this.notificationService.success('User created Successfully');
                resolve(true);
              } else {
                this.notificationService.error(
                  data.description || 'Failed to create user'
                );
              }
            }
          },
          error: (err) => {},
        });
    });
  }

  usersExist(): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      subscriber.next(true);
      // this.angularFirestore.collection('users', ref => ref.limit(2)).valueChanges().pipe(take(1)).subscribe({
      //   next: (data) => {

      //     if (data.length) {

      //       subscriber.next(true);
      //     } else {
      //       subscriber.next(false);
      //     }
      //   },
      //   error: (err) => {
      //   },
      // });
    });
  }

  updateUser(
    userId: number | null,
    updatedUser: Partial<UserInterface>
  ): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/auth/${userId}`, updatedUser);
  }
}
