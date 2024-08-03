import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// import { OrganizationInterface } from '../../interfaces/organization/organization.interface';
import { OrganizationService } from '../../services/organization/organization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { BehaviorSubject, take } from 'rxjs';
// import { OrganizationLoginInterface, PasswordResetInterface } from '../../interfaces/auth/auth.interface';
import { unauthorizedPage } from '../../data/landing-page.data';
import { OrganizationLoginInterface } from '../../interfaces/auth.interface';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { getFromLocalStorage } from 'src/app/functions/local-storage.functions';
import { OrganizationInterface } from '../../interfaces/organization.interface';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Component({
  selector: 'app-select-organization',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-organization.component.html',
  styleUrls: ['./select-organization.component.scss'],
})
export class SelectOrganizationComponent {
  uid?: string;
  token?: string;
  org?: string;
  organization?: string;

  resetPassword = false;

  displayContent = false;

  constructor(
    private organizationService: OrganizationService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private adminService: AdminService
  ) {
    // this.route.queryParams.subscribe(params => {
    //   // Access the query parameters here
    //   this.uid = params['uid'];
    //   this.token = params['token'];
    //   this.org = params['org'];
    //   if (this.org && this.uid && this.token) {
    //     this.authService.passwordResetData.next({
    //       uid: Number(this.uid),
    //       org: Number(this.org),
    //       token: this.token
    //     });
    //     this.submit(this.org);
    //   } else if (this.org) {
    //     this.submit(this.org);
    //   }
    // });
  }

  form: FormGroup = new FormGroup({
    organizationId: new FormControl(null, Validators.required),
  });

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      // Access the query parameters here
      this.uid = params['uid'];
      this.token = params['token'];
      this.org = params['org'];
      this.organization = params['organization'];

      if (this.organization) {
        // this.submit(this.organization);
      } else {
        this.displayContent = true;
      }
    });
  }

  setNewPassword(): boolean {
    let condition = false;
    if (this.uid && this.token && this.org) {
      condition = true;
    }
    return condition;
  }

  // selectOrganization($event: OrganizationLoginInterface) {
  //   this.form.patchValue({
  //     organizationId: $event.orgId,
  //   });
  //   this.submit($event.orgId, true, $event);
  // }

  login(userDetails?: OrganizationLoginInterface) {
    if (!userDetails) return;
    this.authService
      .login({ email: userDetails.email, password: userDetails.password })
      .then((res) => {});
  }

  reload() {
    window.location.reload();
  }

  // submit(
  //   orgId?: string,
  //   auth?: boolean,
  //   userDetails?: OrganizationLoginInterface
  // ) {
  //   const id = orgId || this.form.value.organizationId;
  //   this.organizationService
  //     .getOrganization(id)
  //     .pipe(take(1))
  //     .subscribe({
  //       next: (data) => {
  //         if (orgId && data) {
  //           if (auth) {
  //             this.login(userDetails);
  //           } else {
  //             const organization = getFromLocalStorage(
  //               'organization'
  //             ) as OrganizationInterface | null;
  //             console.log({ organization });

  //             this.router.navigate([unauthorizedPage]);
  //           }
  //         } else {
  //           this.displayContent = true;
  //         }
  //       },
  //       error: (err) => {},
  //     });
  // }
  onSubmit() {
    this.organizationService
      .getOrganizationByOrgCode(this.form.value.organizationId)
      .then((data) => {
        this.localStorageService.setLocalItem('companyInfo', data);
        console.log('selected Org', data);
        this.router.navigate([unauthorizedPage]);
      });
  }
}
