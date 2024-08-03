import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/modules/menu/interfaces/categories';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { ProductIDService } from '../../services/product-id.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchService } from 'src/app/shared/services/SearchService/search.service';

@Component({
  selector: 'app-display-categories',
  templateUrl: './display-categories.component.html',
  styleUrls: ['./display-categories.component.scss'],
})
export class DisplayCategoriesComponent implements OnInit {
  categories: Category[] = [];
  category: Category | null = null;
  selectedCategoryId: string = '';
  query: string = ''; // For search query

  currentPage: number = 1;
  pageSize: number = 5;
  totalProducts: number = 0;
  paginatedCategories: Category[] = [];
  TotalCategories = 0;

  filteredCategories: Category[] = []; // For filtered categories after search
  private searchQuerySubscription: Subscription | undefined;
  constructor(
    private menuService: MenuService,
    private router: Router,
    private searchService: SearchService,
    private productIdService: ProductIDService
  ) {}
  ngOnInit(): void {
    this.loadCategoriesAndSetFirstCategory();
    this.subscribeToSearchQueryChanges(); // Initialize subscription
  }
  loadCategoriesAndSetFirstCategory() {
    this.menuService.getCategories().subscribe((data: any) => {
      // Filter out deleted categories
      this.categories = data.filter((category: any) => !category.deleted);
      console.log('all categoris', this.categories);

      // Update num_products for non-deleted categories
      // this.categories.forEach((category: any) => {
      //   category.num_products = category.products.length;
      // });

      this.filterCategories(); // Initially display all or filtered categories based on the query
    });
  }
  filterCategories() {
    if (this.query.trim() === '') {
      this.filteredCategories = [...this.categories];
    } else {
      const lowercaseQuery = this.query.toLowerCase();
      this.filteredCategories = this.categories.filter((category) =>
        category.category_name.toLowerCase().includes(lowercaseQuery)
      );
    }
    console.log('Filtered Categories', this.filteredCategories);
  }

  paginateCategories() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCategories = this.filteredCategories.slice(
      startIndex,
      endIndex
    );
    console.log('paginated categoris', this.paginatedCategories);
  }
  calculateTotalPages(): number {
    return Math.ceil(this.totalProducts / this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.paginateCategories();
  }

  onSearchInputChange() {
    this.filterCategories();
  }

  displayProductsByCategory(category: Category) {
    const products = category.products;
    console.log('Products for category:', category.category_name);
    products.forEach((product, index) => {
      console.log(`Product ${index + 1}:`, product);
    });
  }

  editCategory(categoryId: string) {
    this.selectedCategoryId = categoryId;
    // Optionally, you can load the category details for editing
    // For example, call an API to get category details based on the categoryId
    // this.menuService.getCategory(categoryId).subscribe((category: Category) => {
    //   // Populate a form with category details for editing
    // });
  }

  cancelEdit() {
    this.selectedCategoryId = '';
  }

  saveCategoryChanges(category: Category) {
    // Call the updateCategory method from MenuService to update the category
    this.menuService.updateCategory(category.id, category).subscribe(() => {
      // Refresh the category list or handle any other necessary updates
      this.loadCategoriesAndSetFirstCategory();
      this.selectedCategoryId = '';
    });
  }
  onInputChange() {
    this.searchService.updateSearchQuery(this.query);
  }

  deleteCategory(id: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.menuService.deleteCategory(id).subscribe(
        (response: any) => {
          // Handle success, update UI or take necessary actions
          console.log('Category soft deleted:', response);
          // Optionally, navigate to a different route or perform other actions
        },
        (error: any) => {
          // Handle error
          console.error('Error deleting category:', error);
        }
      );
    }
  }
  navigateToEdit(category: Category) {
    this.productIdService.setCategoryData(category); // Set the product data in the service
    this.router.navigate(['/admin/edit-category']);
    console.log('Product sent', this.category);
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

  unsubscribeFromSearchQueryChanges() {
    if (this.searchQuerySubscription) {
      this.searchQuerySubscription.unsubscribe();
    }
  }
}
