import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { OrdersModule } from 'src/app/modules/orders/orders.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-customer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],

  templateUrl: './register-customer.component.html',
  styleUrls: ['./register-customer.component.scss'],
})
export class RegisterCustomerComponent implements OnInit {
  customerForm!: FormGroup;
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  cancelCreditSale(): void {
    // Emit the cancel event to notify the parent component
    this.onCancel.emit();
  }

  initForm(): void {
    this.customerForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      creditLimit: [null, Validators.required],
      status: ['', Validators.required],

      // Add other form controls for Credit Sale Details
    });
    console.log(this.customerForm.value);
  }

  submitCreditSale(): void {
    // Handle form submission logic
    if (this.customerForm?.valid) {
      // Your logic here, e.g., call a service to submit the form data
      console.log('Form submitted:', this.customerForm.value);
    }
  }

  submitCustomer(): void {
    if (this.customerForm.valid) {
      // Map the "status" value to a boolean
      const statusValue = this.customerForm.value.status === 'allowed';

      // Create a new object with the correct "status" value
      const customerDetails = {
        ...this.customerForm.value,
        status: statusValue,
      };

      this.adminService.createCustomer(customerDetails).subscribe(
        (response) => {
          // Handle success
          console.log('Customer created successfully:', response);
          this.onCancel.emit();
        },
        (error) => {
          // Handle error
          console.error('Error creating customer:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
}
