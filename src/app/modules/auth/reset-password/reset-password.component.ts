import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Subject, take, takeUntil } from 'rxjs';
import { EncryptionService } from 'src/app/shared/services/encryption/encryption.service';
import { Router } from '@angular/router';
import { ResetPasswordInterface } from 'src/app/shared/interfaces/auth.interface';
import { OrganizationService } from 'src/app/shared/services/organization/organization.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  usersExist = false;
  encryptedOrg: string | null = null;
  resetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  emailSent = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private organizationService: OrganizationService,
    private encryptionService: EncryptionService,
    private router: Router
  ) {
    this.getUser();

    this.organizationService.organization$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data) {
            // this.organizationData = data;
            this.encryptionService
              .encrypt(data.org_code)
              .then((response) => {
                if (response) {
                  this.encryptedOrg = this.encryptionService.decrypt(response);
                } else {
                }
              })
              .catch((err) => {});
          }
        },
        error: (err) => {},
      });
  }

  submit() {
    this.resetPassword(this.resetPasswordForm.value);
  }

  resetPassword(user: ResetPasswordInterface) {
    if (!this.encryptedOrg) return;
    this.resetPasswordForm.reset();
    this.authService
      .resetPassword({ email: user.email, organization: this.encryptedOrg })
      .then((response) => {
        if (response) {
          // this.router.navigate(['/login']);
          this.emailSent = true;
        } else {
        }
      })
      .catch((err) => {});
  }

  reload() {
    window.location.reload();
  }

  getUser() {
    return this.userService
      .usersExist()
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.usersExist = data;
        },
        error: (err) => {},
      });
  }

  // on destroy
  destroy$ = new Subject();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
