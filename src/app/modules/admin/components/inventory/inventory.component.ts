import { Component } from '@angular/core';
import { Category } from 'src/app/modules/menu/interfaces/category';
import { product } from 'src/app/modules/menu/interfaces/products';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { ShiftService } from '../../services/shift.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Subscription } from 'rxjs';
import { SearchService } from 'src/app/shared/services/SearchService/search.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent {
  products: product[] = [];
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  shifts: any[] = []; // Array to hold all shifts
  selectedShiftId: number | null = null; // Track the selected shift ID
  currentShift: any; // Update the type based on your Shift interface or model
  private searchQuerySubscription: Subscription | undefined;
  query: string = ''; // For search query
  buying_price: any;

  constructor(
    private menuService: MenuService,
    private searchService: SearchService,
    private notificationService: HotToastService,
    private shiftService: ShiftService
  ) {}

  ngOnInit(): void {
    this.loadCategoriesAndSetFirstCategory();
    this.subscribeToCurrentShift();
    this.subscribeToSearchQueryChanges(); // Initialize subscription
  }

  subscribeToCurrentShift() {
    this.shiftService.currentShift$.subscribe((shift) => {
      this.selectedShiftId = shift?.id ?? null; // Update the selectedShiftId when currentShift changes
      console.log('Current shift', this.selectedShiftId);
      if (this.selectedShiftId !== null) {
      }
    });
  }

  loadCategoriesAndSetFirstCategory() {
    this.menuService.getCategories().subscribe((data: any) => {
      // Filter out products with is_service set to true
      this.categories = data
        .map((category: any) => ({
          ...category,
          products: category.products.filter(
            (product: any) => !product.is_service
          ),
        }))
        .filter((category: any) => category.products.length > 0);

      // this.filteredCategories = [...this.categories]; // Initially display all or filtered categories based on the query
      this.filterCategories();
      console.log('Categories', data);
    });

    // Initialize quantities and buying prices (if needed) - You may need to modify this based on your data structure
    this.categories.forEach((category) => {
      category.products.forEach((product) => {
        product.product_quantity = 0; // Initialize quantity to 0
        product.buying_price = 0; // Initialize buying price to 0
      });
    });
  }

  filterCategories() {
    if (this.query.trim() === '') {
      this.filteredCategories = [...this.categories];
    } else {
      const lowercaseQuery = this.query.toLowerCase();
      this.filteredCategories = this.categories
        .map((category) => ({
          ...category,
          products: category.products.filter(
            (product) =>
              product.product_name.toLowerCase().includes(lowercaseQuery) &&
              !product.is_service
          ),
        }))
        .filter((category) => category.products.length > 0);
    }
    console.log('Filtered Categories', this.filteredCategories);
  }

  updateProduct(product: product) {
    const categoryId = product.category_id;
    const productId = product.id;

    const parsedProductQuantity = parseInt(product.product_quantity, 10);
    const parsedQuantityToAdd = parseInt(product.quantityToAdd, 10);

    if (!isNaN(parsedProductQuantity) && !isNaN(parsedQuantityToAdd)) {
      const updatedProduct = {
        product_quantity: parsedProductQuantity + parsedQuantityToAdd,
        // Other properties for the update
      };

      this.menuService.updateProduct(productId, updatedProduct).subscribe(
        (response: any) => {
          this.notificationService.success('Inventory Added Successfully');

          // Assuming you have a method in the menuService to post to the inventory
          const updatedProductInventory = {
            product_name: product.product_name, // Use product.name instead
            buying_price: product.buying_price || 1, // Using the existing buying price
            ShiftID: this.selectedShiftId, // Setting the shift to 1 (modify as needed)
            product_quantity_added: parsedQuantityToAdd,
          };
          console.log('data to post to inventory', updatedProductInventory);
          this.menuService
            .postToInventory(updatedProductInventory) // Call a method to post to the inventory table
            .subscribe(
              (inventoryResponse: any) => {
                console.log('resoonses', inventoryResponse);
              },
              (inventoryError: any) => {
                console.log('error', inventoryError);
              }
            );
        },
        (error: any) => {
          this.notificationService.success(
            'Failed To Add Inventory, check Buying Price or Quantity'
          );
          // Handle error
        }
      );
    } else {
      alert('Error: Invalid input'); // Handle invalid input
    }
  }
  subscribeToSearchQueryChanges() {
    this.searchQuerySubscription = this.searchService.searchQuery$.subscribe(
      (query: string) => {
        this.query = query;
        console.log('Search input changed:', this.query);
        this.loadCategoriesAndSetFirstCategory(); // Trigger reloading categories based on the new search query
      }
    );
  }

  onSearchInputChange() {
    this.filterCategories();
  }
  unsubscribeFromSearchQueryChanges() {
    if (this.searchQuerySubscription) {
      this.searchQuerySubscription.unsubscribe();
    }
  }
  onInputChange() {
    this.searchService.updateSearchQuery(this.query);
  }
}
