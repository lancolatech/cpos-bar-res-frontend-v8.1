import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-display-customers',
  templateUrl: './display-customers.component.html',
  styleUrls: ['./display-customers.component.scss'],
})
export class DisplayCustomersComponent {
  loading: boolean = true;
  customers: any[] = [];
  isOpen: any;
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.getAllCustomers();
  }
  getAllCustomersOnCredit() {
    this.loading = true;
    this.isOpen = false;

    this.adminService.getAllOnCreditCustomers().subscribe((data: any) => {
      this.customers = data;
      this.loading = false;
      console.log('customers', this.customers);
    });
  }
  getAllCustomers() {
    this.loading = true;
    this.isOpen = false;

    this.adminService.getAllCustomers().subscribe((data: any) => {
      this.customers = data;
      this.loading = false;
      console.log('customers', this.customers);
    });
  }
  openModal(): void {
    this.isOpen = true;
  }
  closeModal(): void {
    this.isOpen = false;
    this.getAllCustomers();
  }
}
