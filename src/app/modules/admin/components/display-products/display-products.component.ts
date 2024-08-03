import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/modules/menu/interfaces/categories';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { ProductIDService } from '../../services/product-id.service';
import { Router } from '@angular/router';
import { product } from 'src/app/modules/menu/interfaces/products';
import { SearchService } from 'src/app/shared/services/SearchService/search.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-display-products',
  templateUrl: './display-products.component.html',
  styleUrls: ['./display-products.component.scss'],
})
export class DisplayProductsComponent implements OnInit {
  products: product[] = [];
  categories: Category[] = [];
  // Declare a property to store the edited product data
  editedProduct: any = {};

  // Properties to handle modal display
  showModal: boolean = false;

  filteredCategories: Category[] = []; // For filtered categories after search
  private searchQuerySubscription: Subscription | undefined;
  query: string = ''; // For search query
  TotalProducts = 0;

  currentPage: number = 1;
  pageSize: number = 1;
  totalProducts: number = 0;
  paginatedCategories: product[] = [];

  constructor(
    private menuService: MenuService,
    private searchService: SearchService,
    private router: Router,
    private productIdService: ProductIDService
  ) {}
  ngOnInit(): void {
    this.loadCategoriesAndSetFirstCategory();
    this.subscribeToSearchQueryChanges(); // Initialize subscription
    this.getAllCategories();
  }

  loadCategoriesAndSetFirstCategory() {
    this.menuService.getAllProducts().subscribe((data: any) => {
      if (this.query.trim() !== '') {
        // Assuming 'data' is an array of categories fetched from the server
        this.products = data.filter((product: product) =>
          product.product_name.toLowerCase().includes(this.query.toLowerCase())
        );
        // this.paginateCategories();
        this.calculateTotalProducts(); // Calculate total products after loading categories
      } else {
        this.products = data;
        this.calculateTotalProducts(); // Calculate total products after loading categories
      }
    });
  }

  getAllCategories() {
    this.menuService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  getCategoryName(id: string): string {
    const category = this.categories.find((category) => category.id === id);
    if (category) {
      return category.category_name;
    } else {
      return 'loading..';
    }
  }

  filterCategories() {
    if (this.query.trim() === '') {
      this.filteredCategories = [...this.categories];
    } else {
      const lowercaseQuery = this.query.toLowerCase();
      this.filteredCategories = this.categories
        .map((category) => ({
          ...category,
          products: category.products.filter((product) =>
            product.product_name.toLowerCase().includes(lowercaseQuery)
          ),
        }))
        .filter((category) => category.products.length > 0);
    }
    // this.paginateCategories(); // Update paginated categories after filtering
    console.log('Filtered Categories', this.filteredCategories);
  }

  calculateTotalProducts() {
    this.TotalProducts = this.categories.reduce(
      (total, category) => total + category.products.length,
      0
    );
  }
  // paginateCategories() {
  //   const startIndex = (this.currentPage - 1) * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   this.paginatedCategories = this.filteredCategories.slice(
  //     startIndex,
  //     endIndex
  //   );
  //   console.log('paginated categoris', this.paginatedCategories);
  // }
  calculateTotalPages(): number {
    return Math.ceil(this.totalProducts / this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    // this.paginateCategories();
  }
  deleteProduct(id: string): void {
    if (confirm('Are you sure you want to delete this Product?')) {
      this.menuService.deleteproduct(id).subscribe(
        (response: any) => {
          // Handle success, update UI or take necessary actions
          console.log('Product soft deleted:', response);
          this.loadCategoriesAndSetFirstCategory();
        },
        (error: any) => {
          // Handle error
          console.error('Error deleting product:', error);
        }
      );
    }
  }

  navigateToEdit(product: product) {
    this.productIdService.setProductData(product); // Set the product data in the service
    this.router.navigate(['/admin/edit-product']);
    console.log('Product sent', this.products);
  }

  ngOnDestroy(): void {
    this.unsubscribeFromSearchQueryChanges();
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

  // Function to filter categories based on the search query

  // Function to perform live search while typing
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
