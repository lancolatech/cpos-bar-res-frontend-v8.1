import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {
  private csrfToken: string = '';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  getCsrfToken() {
    return this.httpClient.get(`${environment.csrfURL}`, { withCredentials: true }).pipe(take(1)).subscribe({
      next: (data) => {

      },
      error: (err) => {
      },
    });
  }

  getCsrfTokenValue() {
    if (!this.csrfToken) {
      throw new Error('CSRF token not available');
    }
    return this.csrfToken;
  }

  private getCookieValue(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts?.pop()?.split(';').shift();
    } else {
      return null;
    }
  }

  setCookie() {
    // this.cookieService.set('XSRF-TOKEN', response.csrfToken);
  }

}
