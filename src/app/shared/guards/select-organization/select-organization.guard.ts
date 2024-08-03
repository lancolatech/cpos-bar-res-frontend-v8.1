import { LocalStorageService } from './../../services/local-storage/local-storage.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, take } from 'rxjs';
import { OrganizationService } from '../../services/organization/organization.service';
import { selectOrganizationPage } from '../../data/landing-page.data';

@Injectable({
  providedIn: 'root'
})
export class SelectOrganizationGuard implements CanActivate {

  constructor(
    private organizationService: OrganizationService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.getOrganization();
  }


  getOrganization(): Observable<boolean> {
    let result = false;
    return new Observable<boolean>((subscriber) => {
      const organization = this.localStorageService.getItem('organization');
      if (!organization) {
      } else {
        this.organizationService.getOrganization(organization).pipe(take(1)).subscribe({
          next: (data) => {

            if (!data || !organization) {
              this.router.navigate([selectOrganizationPage]);
            }
            subscriber.next(data);
          },
          error: (err) => {
          },
        });
      }
    });

  }

}
