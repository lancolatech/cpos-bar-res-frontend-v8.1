import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import {
  UserInterface,
  UserRolesEnum,
} from 'src/app/shared/interfaces/auth.interface';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { ProductIDService } from '../../services/product-id.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-edit-users',
  templateUrl: './edit-users.component.html',
  styleUrls: ['./edit-users.component.scss'],
})
export class EditUsersComponent implements OnInit {
  user: UserInterface | null = null;
  editedUser: any = {};

  userForm = new FormGroup({
    name: new FormControl<string | null>(null, [Validators.required]),
    username: new FormControl<string | null>(null, [Validators.required]),
    email: new FormControl<string | null>(null, [Validators.required]),
    phone: new FormControl<string | null>(null, [Validators.required]),
    role: new FormControl<UserRolesEnum | null>(null, [Validators.required]),
    createdBy: new FormControl<string | null>(null),
  });

  constructor(
    private productIdService: ProductIDService,
    private userService: UserService,
    private router: Router,
    private notificationService: HotToastService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.user = this.productIdService.getUserData();
    if (this.user) {
      // Load existing user data into editedUser
      this.editedUser = { ...this.user };
      console.log('User To Be Edited', this.editedUser);
    }
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

  toggleRole(role: any) {
    if (this.editedUser.role === role) {
      this.editedUser.role = null; // Uncheck the checkbox if the same role is clicked
    } else {
      this.editedUser.role = role; // Check the clicked checkbox
    }
  }

  submit() {
    const updatedUser: Partial<UserInterface> = {
      fullName: this.userForm.value.name,
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      // phone: this.userForm.value.phone,
      role: this.editedUser.role, // Assume role is set through toggleRole method
    };

    if (this.user) {
      const userId = this.user.id;
      this.userService.updateUser(userId, updatedUser).subscribe(
        () => {
          this.notificationService.success('User updated successfully');
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.notificationService.error('Failed to update user');
          console.error('Error updating user:', error);
        }
      );
    }
  }
}
