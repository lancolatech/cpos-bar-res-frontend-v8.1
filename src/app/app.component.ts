import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, take, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CsrfService } from './shared/services/csrf/csrf.service';
import { OrganizationService } from 'src/app/shared/services/organization/organization.service';
// import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { NavigationService } from './shared/services/navigation/navigation.service';
import { OrganizationInterface } from './shared/interfaces/organization.interface';
import { AuthService } from './shared/services/auth/auth.service';
import { AdminService } from './modules/admin/services/admin.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'cpos-frontend';
  orgStatusInterval: any;
  orgOptions: any;
  organization: OrganizationInterface | null = null;

  constructor(
    private router: Router,
    // private breakpointObserver: BreakpointObserver,
    private csrfService: CsrfService,
    private OrganizationService: OrganizationService,
    private navigationService: NavigationService,
    private httpClient: HttpClient,
    private authService: AuthService,
    private adminService: AdminService
  ) {
    this.getOrganizationData();
    this.authService.checkWhetherSessionHasExpired();

    // this.httpClient
    //   .post(`${environment.apiRootUrl}/encrypt`, { value: '' })
    //   .pipe(take(1))
    //   .subscribe({
    //     next: (data) => {
    //       console.log(data);
    //     },
    //     error: (err) => {},
    //   });
  }
  // getOrgOptions() {
  //   this.OrganizationService.organization$.subscribe((org) => {
  //     if (org) {
  //       this.adminService.getOrgOptions();
  //     }
  //   });
  // }

  ngOnInit() {
    this.updateOrganizationStatus();
    // this.getOrgOptions();

    // new csrf token every hour
    this.orgStatusInterval = setInterval(() => {
      this.csrfService.getCsrfToken();
    }, 60 * 60 * 1000);

    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      } // Scroll to top on navigation to new page
      this.navigationService.scrollToTop('mat-sidenav-content');
      // close the sidenav if mode is mobile
      // if (this.sidenavMode === 'over') {
      //   this.navigationService.closeOrOpenSidenav(true);
      // }
    });

    // this.navigationService.sidenavMode.subscribe((mode) => {
    //   this.sidenavMode = mode;
    // })
  }

  updateOrganizationStatus() {
    this.csrfService.getCsrfToken();
    // this.OrganizationService.checkTokenValidity();
  }

  getOrganizationData() {
    this.OrganizationService.organization$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.organization = data;
        },
        error: () => {},
      });
  }

  destroy$ = new Subject();
  ngOnDestroy(): void {
    this.orgStatusInterval = undefined;
    this.destroy$.next(true);
  }

  // ngAfterViewInit(): void {
  //   // check the screed width
  //   this.breakpointObserver.observe(Breakpoints.Handset).subscribe((res) => {
  //     if (res.matches) {
  //       this.navigationService.toggleSidenavMode('over');
  //     } else {
  //       this.navigationService.toggleSidenavMode('side');
  //     }

  //   })
  // }
}
