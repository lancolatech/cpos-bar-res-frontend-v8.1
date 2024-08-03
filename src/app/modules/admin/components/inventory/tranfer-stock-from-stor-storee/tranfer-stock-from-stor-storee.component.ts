import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription, forkJoin } from 'rxjs';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { UserInterface } from 'src/app/shared/interfaces/auth.interface';
import { SearchService } from 'src/app/shared/services/SearchService/search.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { AdminService } from '../../../services/admin.service';
import { ShiftService } from '../../../services/shift.service';
import { product } from 'src/app/modules/menu/interfaces/products';
import { Category } from 'src/app/modules/menu/interfaces/categories';

@Component({
  selector: 'app-tranfer-stock-from-stor-storee',
  templateUrl: './tranfer-stock-from-stor-storee.component.html',
  styleUrls: ['./tranfer-stock-from-stor-storee.component.scss'],
})
export class TranferStockFromStorStoreeComponent implements OnInit {
  products: product[] = [];
  categories: Category[] = [];
  selectedProducts: product[] = [];
  filteredProducts: product[] = [];
  surpliers: any = [];
  selectedShiftId: number | null = null;
  currentUser: UserInterface | null = null;
  query: string = '';
  orgOptions: any;
  supplierName: string = '';
  loading: boolean = true;
  posting: boolean = false;
  private searchQuerySubscription: Subscription | undefined;
  private categoriesSubscription: Subscription | undefined;

  constructor(
    private menuService: MenuService,
    private searchService: SearchService,
    private adminService: AdminService,
    private shiftService: ShiftService,
    private authService: AuthService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.getOrgOptions();
    this.getAllProducts();
    this.loadCategoriesAndSetFirstCategory();
    this.subscribeToSearchQueryChanges();
    this.getAllSurpliers();
    this.subscribeToCurrentShift();
    this.getCurentUser();
  }
  getOrgOptions() {
    const orgOptionsString = localStorage.getItem('orgOptions');
    if (orgOptionsString) {
      this.orgOptions = JSON.parse(orgOptionsString);
      // console.log('Organization options found in local storage',this.orgOptions);
    } else {
      console.log('Organization options not found in local storage');
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromSearchQueryChanges();
    // this.unsubscribeFromCategoriesChanges();
  }
  getAllSurpliers() {
    this.adminService.getSuppliers().subscribe((data: any) => {
      this.surpliers = data;
      console.log('serpliers', this.surpliers);
    });
  }
  subscribeToCurrentShift() {
    this.shiftService.currentShift$.subscribe((shift) => {
      this.selectedShiftId = shift?.id ?? null; // Update the selectedShiftId when currentShift changes
    });
  }
  getCurentUser() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (!user) {
        console.log('no user');
      }
      this.currentUser = user;
      console.log('current user', this.currentUser);
    });
  }

  getAllProducts() {
    this.menuService.getAllProducts().subscribe((data: any) => {
      if (this.query) {
        this.products = data.filter((product: any) =>
          product.product_name.toLowerCase().includes(this.query.toLowerCase())
        );
        this.loading = false;
      } else {
        this.products = data.filter((product: any) => !product.is_service);
        this.loading = false;
      }
    });
  }

  loadCategoriesAndSetFirstCategory() {
    this.menuService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  filterCategories(): void {
    if (this.query.trim() === '') {
      this.filteredProducts = this.categories.flatMap(
        (category) => category.products
      );
    } else {
      const lowercaseQuery = this.query.toLowerCase();
      this.filteredProducts = this.categories.flatMap((category) =>
        category.products.filter((product) =>
          product.product_name.toLowerCase().includes(lowercaseQuery)
        )
      );
    }
  }

  subscribeToSearchQueryChanges(): void {
    this.searchQuerySubscription = this.searchService.searchQuery$.subscribe(
      (query: string) => {
        this.query = query;
        this.filterCategories();
      }
    );
  }
  onInputChange() {
    if (this.query) {
      this.filteredProducts = this.categories.flatMap((category) =>
        category.products.filter((product) =>
          product.product_name.toLowerCase().includes(this.query.toLowerCase())
        )
      );
      console.log('searched products', this.filteredProducts);
    }
  }

  unsubscribeFromSearchQueryChanges(): void {
    if (this.searchQuerySubscription) {
      this.searchQuerySubscription.unsubscribe();
    }
  }

  onSearchInputChange(): void {
    this.filterCategories();
  }

  onProductClick(product: product): void {
    if (!this.selectedProducts.some((p) => p.id === product.id)) {
      this.selectedProducts.push(product);
      this.query = '';
      this.filterCategories();
      console.log('Selected Products:', this.selectedProducts);
    }
  }

  removeSelectedProduct(index: number): void {
    if (index >= 0 && index < this.selectedProducts.length) {
      this.selectedProducts.splice(index, 1);
    } else {
      console.error('Invalid index for removing selected product');
    }
  }

  transferStock(): void {
    // Validate selected products
    if (this.selectedProducts.length === 0) {
      this.toast.error('Please select at least one product.');
      return;
    }

    // Validate each selected product
    for (const product of this.selectedProducts) {
      if (!product.pax) {
        this.toast.error(
          'Please fill in all fields for the stock Quantity To transfer for all Selected Products.'
        );
        return;
      }
      if (product.store_quantity - product.pax < 0) {
        this.toast.error(
          'Not Enough Quantity To Transfer for' + product.product_name
        );
        return;
      }
    }

    // Create an array to store observables
    const observables = [];
    this.posting = true;

    // Create an observable for each product transfer
    for (const product of this.selectedProducts) {
      const purchaseData = {
        item: product.product_name,
        quantity: product.pax,
        shift_id: this.selectedShiftId,
        moved_by: this.currentUser!.username,
      };
      observables.push(this.adminService.createStockTransfer(purchaseData));
    }

    // Combine all observables and wait for all of them to complete
    forkJoin(observables).subscribe(
      (responses) => {
        console.log('All purchases added:', responses);
        this.toast.success('Stock Transferred successfully');
        this.addProductsAddedQuantityToStore();
        this.posting = false;
      },
      (error) => {
        console.error('Error adding purchases:', error);
        this.toast.error(
          'Error adding purchases check your Internet Connection'
        );
        this.posting = false;
      }
    );
  }

  addProductsAddedQuantityToStore(): void {
    this.selectedProducts.forEach((product) => {
      const purchaseData = {
        product_quantity: product.product_quantity + product.pax!,
        store_quantity: product.store_quantity - product.pax!,
      };
      console.log('quantity to update', purchaseData);
      this.menuService.updateProduct(product.id, purchaseData).subscribe(
        (response) => {
          // console.log('quantity   added:', response);
          // this.toast.success('quantity  added successfully');
          this.clearFilters();
        },
        (error) => {
          console.error('Error adding purchase:', error);
        }
      );
    });
  }
  clearFilters(): void {
    this.query = '';
    this.supplierName = '';
    this.selectedProducts = [];
    this.filterCategories();
  }
}
