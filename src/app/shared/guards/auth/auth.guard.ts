import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { unauthorizedPage } from '../../data/landing-page.data';
import { UserInterface, UserRolesEnum } from '../../interfaces/auth.interface';
import { HotToastService } from '@ngneat/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.userIsLoggedIn().pipe(
      map((user: UserInterface | null) => {
        if (!user || !user.email) {
          return this.router.parseUrl('/login');
        }

        const userRole = user.role as UserRolesEnum;

        if (userRole === UserRolesEnum.ADMIN) {
          return true; // Admin has access to all routes
        } else if (userRole === UserRolesEnum.WAITER) {
          const allowedRoutesForWaiter = [
            'menu',
            'orders',
            'dashboard',
            'tables',
          ];
          const requestedRoute = state.url.split('/')[1];

          if (allowedRoutesForWaiter.includes(requestedRoute)) {
            return true;
          } else {
            this.toast.error('You Are not Authorized For This Page');
            return this.router.parseUrl('/menu');
          }
        } else if (userRole === UserRolesEnum.SALES) {
          const allowedRoutesForSales = [
            'menu',
            'orders',
            'dashboard',
            'shifts',
            'tables',
            'add_petty_cash',
            'sales_reports',
            'inventory',
            'stock',
            'income_reports',
            'credit_sales_report',
            'inventory_reports',
            'advance_report',
          ];
          const requestedRoute = state.url.split('/')[1];

          if (allowedRoutesForSales.includes(requestedRoute)) {
            return true;
          } else {
            this.toast.error('You Are not Authorized For This Page');
            return this.router.parseUrl('/menu');
          }
        }

        // For other roles, handle access as needed

        this.toast.error('You Are not Authorized For This Page');
        return this.router.parseUrl('/menu');
      })
    );
  }

  private isWaiterAuthorizedForRoute(route: string): boolean {
    // Define routes that WAITER is authorized to access within admin module
    const allowedRoutesForWaiter = ['shifts', 'tables'];
    return allowedRoutesForWaiter.includes(route);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const childRoutePath = childRoute.routeConfig?.path || '';

    if (this.isWaiterAuthorizedForRoute(childRoutePath)) {
      return true; // Waiter can access specific routes in admin module
    } else {
      this.toast.error('You Are not Authorized For This Route');
      return this.router.parseUrl('/menu'); // Redirect to 'menu' for unauthorized access
    }
  }

  userIsLoggedIn(): Observable<boolean> {
    return new Observable((subscriber) => {
      this.authService
        .userIsLoggedIn()
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            if (!data) {
              this.router.navigate([unauthorizedPage]);
              subscriber.next(false);
              return;
            }
            if (data.email) {
              subscriber.next(true);
            }
          },
          error: (err) => {
            subscriber.next(false);
          },
        });
    });
  }
}
