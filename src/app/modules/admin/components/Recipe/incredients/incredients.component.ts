import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-incredients',
  templateUrl: './incredients.component.html',
  styleUrls: ['./incredients.component.scss']
})
export class IncredientsComponent {
  newIngredient = {
    name: '',
    unitOfMeasurement: '',
    quantity: 0,
    price: 0
  };

  constructor(private adminService: AdminService) { }

  onSubmit() {
    this.adminService.addIngredient(this.newIngredient).subscribe(
      (response) => {
        console.log('Ingredient added successfully:', response);
        // Optionally, you can reset the form or perform any other actions after successful submission
        this.resetForm();
      },
      (error) => {
        console.error('Error adding ingredient:', error);
        // Handle the error as needed
      }
    );
  }

  resetForm() {
    this.newIngredient = {
      name: '',
      unitOfMeasurement: '',
      quantity: 0,
      price: 0
    };
  }
}
