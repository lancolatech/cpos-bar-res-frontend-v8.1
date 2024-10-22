import { Component, EventEmitter, Output } from '@angular/core';
import {
  DialogRemoteControl,
  AppearanceAnimation,
  DisappearanceAnimation,
} from '@ng-vibe/dialog';
import { StoreCategoriesService } from 'src/app/modules/admin/services/store-categories.service';
import { StoreProductsService } from 'src/app/modules/admin/services/store-products.service';
import { storeCategory } from 'src/app/shared/interfaces/storecategory.interface';
import { storeProduct } from 'src/app/shared/interfaces/storeProduct.interface';
import { StoreProductsFormComponent } from '../store-products-form/store-products-form.component';

@Component({
  selector: 'app-store-product',
  templateUrl: './store-product.component.html',
  styleUrls: ['./store-product.component.scss'],
})
export class StoreProductComponent {
  private dialog: DialogRemoteControl = new DialogRemoteControl(
    StoreProductsFormComponent
  );
  private updateProductDialog: DialogRemoteControl = new DialogRemoteControl(
    StoreProductsFormComponent
  );
  private addProductDialog: DialogRemoteControl = new DialogRemoteControl(
    StoreProductsFormComponent
  );
  products: storeProduct[] = [];
  categories: storeCategory[] = [];
  query: string = '';
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  productIdToEdit: string = '';
  productsLoading: boolean = false;
  @Output() editStudent = new EventEmitter<string>();

  constructor(
    private productService: StoreProductsService,
    private categoryService: StoreCategoriesService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.getCategories();
  }

  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
    this.getAllProducts(); // Refresh products after editing
  }

  printProducts() {
    window.print();
  }

  toggleEditModal(id: string) {
    this.productIdToEdit = id;
    this.isEditModalVisible = !this.isEditModalVisible;
    if (id !== null) {
      this.editStudent.emit(id); // Emit event with student ID
    }
    this.getAllProducts(); // Refresh products after editing
  }
  getAllProducts(searchQuery?: string): void {
    this.productsLoading = true;
    this.productService.getAllStoreProducts().subscribe((products) => {
      if (searchQuery && searchQuery.trim() !== '') {
        this.products = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.categoryId.toLowerCase().includes(searchQuery.toLowerCase())
        );
        this.productsLoading = false;
      } else {
        this.products = products;
        this.productsLoading = false;
      }
      console.log('Filtered products', this.products);
    });
  }

  onInputChange(): void {
    console.log('Query changed', this.query);
    this.getAllProducts(this.query);
  }

  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteStoreProduct(id).subscribe((res) => {
        this.getAllProducts(this.query); // Refresh products after deletion
      });
    }
  }

  openDialog(optionalPayload?: any) {
    this.dialog.options = {
      width: '400px',
      height: '400px',
      showOverlay: true,
      animationIn: AppearanceAnimation.ZOOM_IN_ROTATE,
      animationOut: DisappearanceAnimation.ZOOM_OUT,
    };

    this.dialog.openDialog(optionalPayload).subscribe((resp) => {
      console.log('Response from dialog content:', resp);
    });
    // this.printReceipt(sales);
  }
  openUpdateProductModal(optionalPayload?: any) {
    this.updateProductDialog.options = {
      width: '30%',
      height: '90vh',
      showOverlay: true,
      animationIn: AppearanceAnimation.ZOOM_IN_ROTATE,
      animationOut: DisappearanceAnimation.ZOOM_OUT,
    };

    this.updateProductDialog.openDialog(optionalPayload).subscribe((resp) => {
      console.log('Response from dialog content:', resp);
    });
    // this.printReceipt(sales);
  }
  openAddProductModal(optionalPayload?: any) {
    this.addProductDialog.options = {
      width: '30%',
      height: '90vh',
      showOverlay: true,
      animationIn: AppearanceAnimation.ZOOM_IN_ROTATE,
      animationOut: DisappearanceAnimation.ZOOM_OUT,
    };

    this.addProductDialog.openDialog(optionalPayload).subscribe((resp) => {
      console.log('Response from dialog content:', resp);
    });
    // this.printReceipt(sales);
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

  getCategoryNameById(id: string) {
    const category = this.categories.find((category) => category.id === id);
    if (category) {
      return category.name;
    }
    return 'Loading...';
  }

  generatePrintableProductPage() {
    // Open a new window
    const printWindow = window.open('', '_blank');

    // Generate the HTML content for the product list
    const productsHtml = this.products
      .map(
        (product) => `
      <tr>
        <td>${product.name}</td>
        <td>${this.getCategoryNameById(product.categoryId)}</td>
        <td></td>
      </tr>
    `
      )
      .join('');

    // Write the HTML content to the new window, including styles
    printWindow!.document.write(`
      <html>
        <head>
          <title>Product Stock List</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
            .signature-line { border-top: 1px solid #000; width: 200px; margin-top: 70px; }
            @media print {
              body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <h1>Product Stock List</h1>
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${productsHtml}
            </tbody>
          </table>
          <div class="signature-section">
            <div>
              <p>Prepared by: ___________________________</p>
              <div class="signature-line"></div>
              <p>Signature</p>
            </div>
            <div>
              <p>Approved by: ___________________________</p>
              <div class="signature-line"></div>
              <p>Signature</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow!.document.close();

    // Wait for the content to load before printing
    printWindow!.onload = function () {
      printWindow!.print();
      printWindow!.onafterprint = function () {
        printWindow!.close();
      };
    };
  }
}
