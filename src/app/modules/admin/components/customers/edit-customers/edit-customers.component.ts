import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-edit-customers',
  templateUrl: './edit-customers.component.html',
  styleUrls: ['./edit-customers.component.scss'],
})
export class EditCustomersComponent {
  customerForm!: FormGroup;
  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Input() customerId: string = '';

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

  getCustomerDetailsById(id: string) {
    this.adminService.getCustomerById(id).subscribe(
      (data) => {
        this.customerForm.patchValue({
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          creditLimit: data.creditLimit,
          status: data.status,
          // Assign other form control values from the data object
        });
      },
      (error) => {
        console.error('Error fetching customer details:', error);
      }
    );
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
