import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import {
  AppearanceAnimation,
  DialogRemoteControl,
  DisappearanceAnimation,
} from '@ng-vibe/dialog';
import { StorePurchase, StorePurchaseItem } from 'src/app/shared/interfaces/store-purchase.interface';
import { StorePurchasesService } from 'src/app/modules/admin/services/Store-Purchases/store-purchases.service';
import { storeProduct } from 'src/app/shared/interfaces/storeProduct.interface';
import { StoreProductsService } from 'src/app/modules/admin/services/store-products.service';
import { AdminService } from 'src/app/modules/admin/services/admin.service';

@Component({
  selector: 'app-store-purchases',
  templateUrl: './store-purchases.component.html',
  styleUrls: ['./store-purchases.component.scss']
})
export class StorePurchasesComponent {
  products: storeProduct[] = [];
  suppliers: any[] = [];

  StorePurchases: StorePurchase[] = [];
  filteredStorePurchase: StorePurchase[] = [];
  StorePurchasesLoading: boolean = false;
  searchTerm: any;
  onSearch() {
    throw new Error('Method not implemented.');
  }
  startDate: any;
  endDate: any;
  selectedDate: any;
  searchQuery: string = '';

  constructor(
    private StorePurchaseService: StorePurchasesService,
    private productService: StoreProductsService,
    private toast: HotToastService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadSuppliers();
    this.getStorePurchaseForSingle();
  }

  getAllStorePurchase() {
    this.StorePurchaseService.getAllPurchases().subscribe(
      (StorePurchases) => (this.StorePurchases = StorePurchases),
      (error) => console.error('Error loading LPO:', error)
    );
  }

  getStorePurchaseForSingle() {
    const day = this.selectedDate || new Date();
    this.StorePurchaseService.getPurchasesByDateRange(day, day).subscribe(
      (StorePurchases) => {
        this.StorePurchases = StorePurchases;
        this.filteredStorePurchase = StorePurchases;
      },
      (error) => {
        console.error('Error loading Purchases:', error);
        this.toast.error('Error loading Purchases');
        this.StorePurchasesLoading = false;
      }
    );
  }

  getStorePurchaseForRange(startDate: string, endDate: string) {
    if (!startDate || !endDate) {
      return;
    }
    this.StorePurchaseService.getPurchasesByDateRange(
      startDate,
      endDate
    ).subscribe(
      (StorePurchases) => {
        this.StorePurchases = StorePurchases;
        this.filteredStorePurchase = StorePurchases;
      },
      (error) => {
        console.error('Error loading Purchases:', error);
        this.toast.error('Error loading Purchases');
        this.StorePurchasesLoading = false;
      }
    );
  }

  loadProducts() {
    this.productService.getAllStoreProducts().subscribe(
      (products) => (this.products = products),
      (error) => console.error('Error loading products:', error)
    );
  }

  getProductNameById(id: string): string {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product.name;
    } else {
      return 'Loading...';
    }
  }

  loadSuppliers() {
    this.adminService.getSuppliers().subscribe(
      (suppliers) => (this.suppliers = suppliers),
      (error) => console.error('Error loading suppliers:', error)
    );
  }

  getSupplierNameById(id: string): string {
    const supplier = this.suppliers.find((p) => p.id === id);
    if (supplier) {
      return supplier.name;
    } else {
      return 'Loading...';
    }
  }

  deleteStorePurchase(id: string): void {
    if (confirm('Are you sure you want to delete this purchase?')) {
      this.StorePurchaseService.deletePurchase(id).subscribe((res) => {
        this.getAllStorePurchase();
      });
    }
  }

  printGRN(purchase: StorePurchase): void {
    const date = new Date(purchase.created_at!).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    let grnContent = `
      <div style="text-align: center;">
        <img src=" " alt="" style="max-width: 500px;">
        <h2></h2>
        <p></p>
        <p></p>
        <h1>GOODS RECEIVED NOTE</h1>
        <h3>${this.getSupplierNameById(purchase.supplier_id)}</h3>
        <p> DATE: ${date}</p>
      </div>

      <table border="1" style="width: 100%; border-collapse: collapse;">
        <tr>
          <th>#</th>
          <th>Item Name</th>
          <th>QTY</th>
          <th>Buying Price</th>
          <th>Amount</th>
        </tr>
    `;

    let totalAmount = 0;
    purchase.items.forEach((item, index) => {
      const amount = item.quantity * item.price;
      totalAmount += amount;
      grnContent += `
        <tr>
          <td>${index + 1}</td>
          <td>${this.getProductNameById(item.productId)}</td>
          <td>${item.quantity}</td>
          <td>${item.price.toFixed(2)}</td>
          <td>${amount.toFixed(2)}</td>
        </tr>
      `;
    });

    grnContent += `
      </table>
      <table style="width: 100%; margin-top: 20px;">
        <tr>
          <td>Invoice Amount</td>
          <td style="text-align: right;">${totalAmount.toFixed(2)}</td>
        </tr>
        <tr>
          <td>VAT</td>
          <td style="text-align: right;">0.00</td>
        </tr>
        <tr>
          <td><strong>Total Amount</strong></td>
          <td style="text-align: right;"><strong>${totalAmount.toFixed(
            2
          )}</strong></td>
        </tr>
      </table>

      <div style="margin-top: 50px; display: flex; justify-content: space-between;">
        <div>
          <p>Received by: _________________________</p>
        </div>
        <div>
          <p>Signature: _________________________</p>
        </div>
        <div>
          <p>Date: _________________________</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow!.document.write(`
      <html>
        <head>
          <title>GRN - ${purchase.id}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${grnContent}
        </body>
      </html>
    `);
    printWindow!.document.close();
    printWindow!.print();
  }

}
