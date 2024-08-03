import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/modules/menu/interfaces/category';
import { ProductIDService } from '../../services/product-id.service';
import { product } from 'src/app/modules/menu/interfaces/products';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.scss'],
})
export class EditProductsComponent {
  showModal: boolean = false;
  editedProduct: any = {}; // Replace 'any' with your product interface

  categories: Category[] = []; // Initialize with your category data
  product: product | null = null;

  constructor(
    private productIdService: ProductIDService,
    private router: Router,
    private notificationService: HotToastService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.product = this.productIdService.getProductData();
    if (this.product) {
      this.editedProduct = { ...this.product }; // Load existing product data into editedProduct
    }
    // Fetch categories when the component initializes
    this.menuService.getCategories().subscribe((response: any) => {
      this.categories = response;
    });
  }

  onEditSubmit() {
    if (this.product) {
      const { category_id, id } = this.product; // Extract categoryId and productId from product data
      this.updateProductData(category_id, id, this.editedProduct);
      console.log('Edited product:', this.editedProduct);
    }
  }

  updateProductData(
    categoryId: number,
    productId: string,
    updatedProductData: any
  ) {
    this.menuService.updateProduct(productId, updatedProductData).subscribe(
      (response) => {
        // Handle success, maybe show a success message or take appropriate action
        console.log('Product updated:', response);
        this.notificationService.success('Product Updated');
        this.router.navigate(['/admin/products']);
      },
      (error) => {
        // Handle error, show error essage or take appropriate action
        console.error('Error updatingm product:', error);
      }
    );
  }
}
