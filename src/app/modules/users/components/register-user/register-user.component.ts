import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil, Subject } from 'rxjs';
import {
  UserInterface,
  UserRolesEnum,
} from 'src/app/shared/interfaces/auth.interface';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent {
  user: UserInterface | null = null;

  userForm = new FormGroup({
    fullName: new FormControl<string | null>(null, [Validators.required]),
    username: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [Validators.required]),
    phone: new FormControl<string | null>(null, [Validators.required]),
    role: new FormControl<UserRolesEnum | null>(null, [Validators.required]),
    createdBy: new FormControl<string | null>(null),
  });

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {
    this.getCurrentUser();
  }

  getCurrentUser() {
    // get current user
    this.authService.user$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        console.log(data);
        this.user = data;
      },
      error: (err) => {},
    });
  }

  // Gets user roles
  getUserRoles(): UserRolesEnum[] {
    const rolesArray: UserRolesEnum[] = Object.values(UserRolesEnum).filter(
      (value) => typeof value === 'string'
    ) as UserRolesEnum[];
    return rolesArray;
  }

  setUserRole(role: UserRolesEnum) {
    this.userForm.patchValue({
      role,
    });
  }

  submit() {
    if (!this.user) return;

    // add current user to the form
    this.userForm.patchValue({
      createdBy: this.user.email,
    });

    const user = this.userForm.value as Partial<UserInterface>;
    this.userService.registerUser(user).then((res) => {
      if (res) {
        this.userForm.reset();
      }
    });
  }

  // on destroy
  destroy$ = new Subject();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
