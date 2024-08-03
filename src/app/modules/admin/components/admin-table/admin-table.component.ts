import { Component, Input, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { UserInterface } from 'src/app/shared/interfaces/auth.interface';
import { ProductIDService } from '../../services/product-id.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-table',
  templateUrl: './admin-table.component.html',
  styleUrls: ['./admin-table.component.scss'],
})
export class AdminTableComponent implements OnInit {
  @Input() users: any[] = [];

  constructor(
    private userService: UserService,
    private router: Router,
    private productIdService: ProductIDService
  ) {}
  ngOnInit(): void {
    this.getAllUsers();
  }
  getAllUsers() {
    this.userService
      .getAllUsers()
      .then((users: UserInterface[]) => {
        // Handle the list of users here. You can assign it to your component's users property.
        this.users = users;
        console.log('user:', users);
      })
      .catch((error) => {
        // Handle errors if needed.
      });
  }
  navigateToEdit(user: UserInterface) {
    this.productIdService.setUserData(user); // Set the product data in the service
    this.router.navigate(['/admin/edit-users']);
  }
}
