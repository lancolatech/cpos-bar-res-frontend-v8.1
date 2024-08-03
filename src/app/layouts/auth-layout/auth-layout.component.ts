import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrganizationInterface } from 'src/app/shared/interfaces/organization.interface';
import { defaultOrganizationData } from 'src/app/shared/data/organization.data';
import { OrganizationService } from 'src/app/shared/services/organization/organization.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Subject, take, takeUntil } from 'rxjs';
import { SelectOrganizationComponent } from 'src/app/shared/components/select-organization/select-organization.component';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SelectOrganizationComponent],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
})
export class AuthLayoutComponent {
  organizationData: OrganizationInterface | null = null;
  image = defaultOrganizationData.imageURL;

  constructor(
    private organizationService: OrganizationService,
    private authService: AuthService,
    private localStorageService: LocalStorageService
  ) {
    this.authService.logout();

    this.organizationService.organization$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.organizationData = data;
        },
        error: (err) => {},
      });
    // this.getOrganization();
  }

  // ngOnInit() {
  //   this.route.queryParams.subscribe(params => {
  //     // Access the query parameters here
  //     this.uid = params['uid'];
  //     this.token = params['token'];
  //     this.org = params['org'];
  //   });
  // }

  // getOrganization() {
  //   const companyInfo = this.localStorageService.getItem('companyInfo', true);
  //   if (companyInfo) {
  //     const organization = companyInfo as OrganizationInterface;
  //     this.organizationService
  //       .getOrganization(organization.id)
  //       .pipe(take(1))
  //       .subscribe({
  //         next: (data) => {},
  //         error: (err) => {},
  //       });
  //   }
  // }

  unselectOrganization() {
    const agree = confirm(`Leave ${this.organizationData?.name}?`);
    if (agree) {
      this.organizationService.unSelectOrganization();
    }
  }

  // on destroy
  destroy$ = new Subject();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
