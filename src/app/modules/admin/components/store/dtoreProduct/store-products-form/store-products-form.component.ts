import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoreCategoriesService } from 'src/app/modules/admin/services/store-categories.service';
import { StoreProductsService } from 'src/app/modules/admin/services/store-products.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'app-store-products-form',
  templateUrl: './store-products-form.component.html',
  styleUrls: ['./store-products-form.component.scss'],
})
export class StoreProductsFormComponent
  extends ModalComponent
  implements OnInit
{
  @Input() productId: string = '';
  storeProductForm: FormGroup;
  categories: any[] = [];
  isUpdateMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private storeProductService: StoreProductsService,
    private categoryService: StoreCategoriesService
  ) {
    super();
    this.storeProductForm = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      // QuantityPerBulk: ['', [Validators.required, Validators.min(0)]],
      // bulkBuyingPrice: ['', [Validators.required, Validators.min(0)]],
      // bulkPrice: ['', [Validators.required, Validators.min(0)]],
      uom: ['', Validators.required],
      // productEuniqueId: ['', Validators.required],
      // description: ['', Validators.required],
      // bulkUnit: ['', Validators.required],
      categoryId: ['', Validators.required],
      buying_price: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCategories();
    if (this.productId) {
      this.isUpdateMode = true;
      this.loadProductDetails();
    }
  }

  getCategories() {
    this.categoryService.getAllStoreCategories().subscribe(
      (response: any) => {
        this.categories = response;
      },
      (error) => {
        console.error('Error getting categories', error);
      }
    );
  }

  loadProductDetails() {
    this.storeProductService.getStoreProductbyId(this.productId).subscribe(
      (product) => {
        this.storeProductForm.patchValue(product);
      },
      (error) => {
        console.error('Error loading product details', error);
      }
    );
  }

  onSubmit() {
    if (this.storeProductForm.valid) {
      if (this.isUpdateMode) {
        this.updateProduct();
      } else {
        this.createProduct();
      }
    }
    this.close();
  }

  createProduct() {
    this.storeProductService
      .addStoreProduct(this.storeProductForm.value)
      .subscribe(
        (response) => {
          console.log('Product created successfully', response);
          this.close();
        },
        (error) => {
          console.error('Error creating product', error);
        }
      );
  }

  updateProduct() {
    this.storeProductService
      .updateStoreProduct(this.productId, this.storeProductForm.value)
      .subscribe(
        (response) => {
          console.log('Product updated successfully', response);
          this.close();
        },
        (error) => {
          console.error('Error updating product', error);
        }
      );
  }
}
