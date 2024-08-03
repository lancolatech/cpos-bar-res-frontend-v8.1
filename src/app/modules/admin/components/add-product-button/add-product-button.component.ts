import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AdminModule } from '../../admin.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddProductFormComponent } from '../add-product-form/add-product-form.component';

@Component({
  selector: 'app-add-product-button',
  // standalone:true,
  // imports: [CommonModule,RouterModule,AdminModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-product-button.component.html',
  styleUrls: ['./add-product-button.component.scss']
})
export class AddProductButtonComponent {




constructor(private router:Router){}

  navigateToAddProduct() {
    this.router.navigate(['/admin/add-product']);
  }

}
