import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpXsrfTokenExtractor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { OrganizationInterface } from 'src/app/shared/interfaces/organization.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { UserInterface } from '../../interfaces/auth.interface';
@Injectable({
  providedIn: 'root',
})
export class ApiInterceptorService implements HttpInterceptor {
  organization: OrganizationInterface | null = null;
  user: UserInterface | null = null;
  constructor(
    private tokenExtractor: HttpXsrfTokenExtractor,
    private localStorageService: LocalStorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // TODO:: Check that the api access token exists if not, log the user out immediately and delete auth info from local storage
    let finalRequest = request;
    if (request.method !== 'GET') {
      const headerName = 'XSRF-TOKEN';
      const token = this.tokenExtractor.getToken() ?? 'DEFAULT';

      const requestWithCsrfToken = request.clone({
        headers: request.headers.set(headerName, token),
      });
      finalRequest = requestWithCsrfToken;
    }
    const Bearer = this.localStorageService.getItem('token', true);
    const org = this.localStorageService.getItem('organization');

    // const orgPromise2 = this.localStorageService.getItem('organization', true);
    const clonedRequest = finalRequest.clone({
      setHeaders: {
        organization: org || 'DEFAULT',
        Authorization: `Bearer ${Bearer}`,
      },
    });
    return next.handle(clonedRequest).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
        }
      })
    );
  }

  // on destroy
  destroy$ = new Subject();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  // get http cookie
}
