import {
  Component,
  ElementRef,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MenuItem } from '../../models/menu-item';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminModule } from '../../admin.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserRolesEnum } from 'src/app/shared/interfaces/auth.interface';
import { HttpClient } from '@angular/common/http';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { environment } from 'src/environments/environment';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-add-product-form',
  // imports: [CommonModule,RouterModule,AdminModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-product-form.component.html',
  styleUrls: ['./add-product-form.component.scss'],
})
export class AddProductFormComponent implements OnInit {
  private apiUrl = `${environment.apiRootUrl}/categories`;
  // productApiUrl = 'http://127.0.0.1:8000/api'; // API endpoint for creating products
  productName: string = '';
  productPrice: number = 0;
  productQuantity: number = 0;
  productStoreQuantity: number = 0;
  selectedCategory: string = ''; // Initialize to 0
  categories: any[] = []; // Initialize to an empty array
  is_service: boolean = false; // New property to track checkbox status
  is_kitchen_product: boolean = false; // New property to track checkbox status
  specificationArray: string | null = null;

  constructor(
    private http: HttpClient,
    private categoryService: MenuService,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit() {
    // Fetch categories when the component initializes
    this.categoryService.getCategories().subscribe((response: any) => {
      this.categories = response;
    });
  }

  onSubmit() {
    if (this.selectedCategory === '') {
      console.error('Please select a category.');
      return;
    }

    let productQuantityToSend = this.is_service ? 0 : this.productQuantity;
    let productStoreQuantityToSend = this.is_service
      ? 0
      : this.productStoreQuantity;

    const productData = {
      product_name: this.productName,
      product_price: this.productPrice,
      product_quantity: productQuantityToSend,
      store_quantity: productStoreQuantityToSend,
      category_id: this.selectedCategory,
      deleted: false,
      is_service: this.is_service,
      is_kitchen_product: this.is_kitchen_product,
      specification:
        this.specificationArray?.split(',').map((spec) => spec.trim()) || null, // Split string and create an array
    };
    console.log('Product to be created details', productData);

    // Use the selected category ID in the URL
    const url = `${this.apiUrl}/${this.selectedCategory}/products`;

    this.categoryService.createProducts(productData).subscribe(
      (response: any) => {
        console.log('Product created successfully', response);
        this.toast.success('Product created successfully');
        // Reset the form or handle success as needed
        this.productName = '';
        this.productPrice = 0;
        this.productQuantity = 0;
        this.productStoreQuantity = 0;
        this.selectedCategory = '';
        this.is_service = false;
        this.is_kitchen_product = false;
        this.specificationArray = '';
        this.router.navigate(['/admin/products']);
      },
      (error) => {
        this.toast.error('Error creating product');
        // Handle errors, e.g., display an error message to the user
      }
    );
  }
}
