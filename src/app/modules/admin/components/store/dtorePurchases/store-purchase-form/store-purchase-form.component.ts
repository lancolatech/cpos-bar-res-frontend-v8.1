import { Component, OnInit } from '@angular/core';
import { storeProduct } from 'src/app/shared/interfaces/storeProduct.interface';
import { StoreProductsService } from 'src/app/modules/admin/services/store-products.service';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { StorePurchase, StorePurchaseItem } from 'src/app/shared/interfaces/store-purchase.interface';
import { StorePurchasesService } from 'src/app/modules/admin/services/Store-Purchases/store-purchases.service';
import { InventoryService } from 'src/app/modules/admin/services/Inventory/inventory.service';

interface PaymentMode {
  method: string;
  amount: number;
  transactionId?: string;
}

@Component({
  selector: 'app-store-purchase-form',
  templateUrl: './store-purchase-form.component.html',
  styleUrls: ['./store-purchase-form.component.scss']
})

export class StorePurchaseFormComponent implements OnInit  {
  products: storeProduct[] = [];
  selectedProducts: StorePurchaseItem[] = [];
  suppliers: any[] = [];
  query: string = '';
  currentUser: string = 'Current User'; // Replace with actual user authentication
  isPaymentModalVisible: boolean = false;
  isPaid: boolean = false;
  paymentMethods: PaymentMode[] = [{ method: 'Mpesa', amount: 0 }];
  creditAmount: number = 0;
  grandTotal: number = 0;
  selectedSupplier: any | null = null;

  constructor(
    private productService: StoreProductsService,
    private purchaseService: StorePurchasesService,
    private suppliersService: AdminService,
    private inventoryService:  InventoryService 
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.getAllSuppliers();
  }

  getCurrentUser(): string {
    const user = JSON.parse(localStorage.getItem('user') || '');
    return user.username;
  }

  getAllProducts(searchQuery?: string): void {
    this.productService.getAllStoreProducts().subscribe((products) => {
      if (searchQuery && searchQuery.trim() !== '') {
        this.products = products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.categoryId.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else {
        this.products = products;
      }
    });
  }
  getProductNameById(productId: string): string {
    const product = this.products.find((p) => p.id === productId);
    return product ? product.name : 'Unknown Product';
  }

  getProductPriceById(productId: string): number {
    const product = this.products.find((p) => p.id === productId);
    return product ? product.price : 0;
  }

  getAllSuppliers(searchQuery?: string) {
    this.suppliersService.getSuppliers().subscribe(
      (data: any[]) => {
        if (searchQuery && searchQuery.trim() !== '') {
          this.suppliers = data.filter(
            (supplier) =>
              supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              supplier.phone.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else {
          this.suppliers = data;
        }
      },
      (error: any) => {
        console.error('Error fetching suppliers:', error);
      }
    );
  }

  onInputChange(): void {
    this.getAllProducts(this.query);
  }

  onProductClick(product: storeProduct): void {
    if (!this.selectedProducts.some((p) => p.productId === product.id)) {
      this.selectedProducts.push({
        productId: product.id,
        price: +product.buying_price,
        quantity: 1,
        subtotal: +product.buying_price,
        purchaseType: 'single',
      });
      this.query = '';
      this.calculateGrandTotal();
    }
  }

  calculateGrandTotal(): void {
    console.log(this.selectedProducts);
    this.grandTotal = this.selectedProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    this.creditAmount = this.grandTotal;
    console.log("Grand tota'", this.grandTotal);
  }

  onQuantityChange(product: StorePurchaseItem): void {
    product.subtotal = product.buying_price * product.quantity;
    this.calculateGrandTotal();
  }

  onPurchaseTypeChange(product: StorePurchaseItem): void {
    const storeProduct = this.products.find((p) => p.id === product.productId);
    if (storeProduct) {
      product.price =
        product.purchaseType === 'bulk'
          ? storeProduct.bulkPrice : storeProduct.price;
      this.onQuantityChange(product);
    }
  }

  removeSelectedProduct(index: number): void {
    if (index >= 0 && index < this.selectedProducts.length) {
      this.selectedProducts.splice(index, 1);
      this.calculateGrandTotal();
    }
  }

  openPaymentModal() {
    if (this.selectedProducts.length === 0) {
      alert('Please select at least one product.');
      return;
    }

    if (!this.selectedSupplier) {
      alert('Please select a supplier.');
      return;
    }

    for (const product of this.selectedProducts) {
      if (!product.price || !product.quantity) {
        alert('Please fill in all fields for the selected products.');
        return;
      }
    }
    this.isPaymentModalVisible = true;
    this.resetPaymentForm();
  }

  closePaymentModal() {
    this.isPaymentModalVisible = false;
  }

  resetPaymentForm() {
    this.isPaid = false;
    this.paymentMethods = [{ method: 'Mpesa', amount: 0 }];
    this.creditAmount = 0;
  }

  addPaymentMode() {
    this.paymentMethods.push({ method: 'Cash', amount: 0 });
  }

  removePaymentMode(index: number) {
    this.paymentMethods.splice(index, 1);
  }

  getTotalPaidAmount(): number {
    return this.paymentMethods.reduce((total, mode) => total + mode.amount, 0);
  }

  completePurchase() {
    if (this.selectedProducts.length === 0 || !this.selectedSupplier) {
      alert('Please select products and a supplier.');
      return;
    }

    if (this.isPaid) {
      const totalPaid = this.getTotalPaidAmount();
      if (totalPaid !== this.grandTotal) {
        alert(
          `Total paid amount (${totalPaid}) does not match the grand total (${this.grandTotal}).`
        );
        return;
      }
    } else {
      if (this.creditAmount !== this.grandTotal) {
        console.log('Credit amount:', this.creditAmount);
        console.log('Grand total:', this.grandTotal);
        alert(
          `Credit amount (${this.creditAmount}) does not match the grand total (${this.grandTotal}).`
        );
        return;
      }
    }

    const purchaseData: StorePurchase = {
      items: this.selectedProducts,
      supplier_id: this.selectedSupplier.id,
      added_by: this.getCurrentUser(),
      grandTotal: this.grandTotal,
      deleted: false,
      paymentMethods: this.isPaid ? this.paymentMethods : [],
      amountPaid: this.isPaid ? this.getTotalPaidAmount() : 0,
      creditAmount: this.isPaid ? 0 : this.creditAmount,
    };

    this.purchaseService.createPurchase(purchaseData).subscribe(
      (response) => {
        console.log('Purchase added:', response);
        alert('Purchase added successfully');
        this.clearFilters();
        this.closePaymentModal();
      },
      (error) => {
        console.error('Error adding purchase:', error);
        alert(
          'Error adding purchase: ' +
            (error.error?.message || 'Please check your internet connection.')
        );
      }
    );
    const purchaseDataa: any = {
      items: this.selectedProducts.map((product) => ({
        product_id: product.id,
        name: product.name,
        quantity: product.quantityToAdd!,
        buying_price: product.buying_price!,
        total: product.buying_price! * product.quantityToAdd!,
      })),
      supplier_id: this.selectedSupplier.id,
      added_by: this.getCurrentUser(),
      grandTotal: this.grandTotal,
      deleted: false,
      paymentMethods: this.isPaid ? this.paymentMethods : [],
      amountPaid: this.isPaid ? this.getTotalPaidAmount() : 0,
      creditAmount: this.isPaid ? 0 : this.creditAmount,
    };

    this.inventoryService.addInventory(purchaseDataa).subscribe(
      (response) => {
        console.log('Inventory added:', response);
      },
      (error) => {
        console.error('Error adding inventory:', error);
        alert(
          'Error adding inventory: ' +
            (error.error?.message || 'Please check your internet connection.')
        );
      }
    );
  }

  clearFilters(): void {
    this.query = '';
    this.selectedProducts = [];
    this.selectedSupplier = null;
    this.getAllProducts();
    this.resetPaymentForm();
    this.grandTotal = 0;
  }

}
