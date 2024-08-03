import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { SearchService } from 'src/app/shared/services/SearchService/search.service';
import { ProductIDService } from '../../services/product-id.service';
import { product } from 'src/app/modules/menu/interfaces/products';
import { Category } from 'src/app/modules/menu/interfaces/categories';

@Component({
  selector: 'app-display-inventory',
  templateUrl: './display-inventory.component.html',
  styleUrls: ['./display-inventory.component.scss'],
})
export class DisplayInventoryComponent {
  product: product[] = [];
  categories: Category[] = [];
  loading: boolean = true;
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
  paginatedCategories: Category[] = [];

  constructor(
    private menuService: MenuService,
    private searchService: SearchService,
    private router: Router,
    private productIdService: ProductIDService
  ) {}
  ngOnInit(): void {
    this.getAllProducts();
    this.loadCategoriesAndSetFirstCategory();
    this.subscribeToSearchQueryChanges(); // Initialize subscription
  }

  getAllProducts() {
    this.menuService.getAllProducts().subscribe((data: any) => {
      this.TotalProducts = data.length;
      if (this.query) {
        this.product = data.filter((product: any) =>
          product.product_name
            .toLowerCase()
            .includes(this.query.toLowerCase() )
        );
        this.loading = false;
      } else {
        this.product = data.filter((product: any) => !product.is_service);
        this.loading = false;
      }
    });
  }

  loadCategoriesAndSetFirstCategory() {
    this.menuService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  getCategoryName(id: string): string {
    let categoryName = this.categories.find((category) => category.id == id);
    if (categoryName) {
      return categoryName.category_name;
    } else {
      return '';
    }
  }

  calculateTotalProducts() {
    this.TotalProducts = this.categories.reduce(
      (total, category) => total + category.products.length,
      0
    );
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
    this.paginateCategories(); // Update paginated categories after filtering
    console.log('Filtered Categories', this.filteredCategories);
  }
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

  printReport() {
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      const content = `
          <html>
            <head>
              <title>Product Report</title>
              <style>
  body {
    font-family: 'Arial', sans-serif;
    margin: 20px;
  }

  .container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    border: 1px solid #ddd;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .header {
    text-align: center;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  .footer {
    margin-top: 20px;
    text-align: center;
    font-style: italic;
    color: #555;
  }
</style>

            </head>
    
            <body>
              <div class="container">
                <div class="header">
                  <h2>Product Report</h2>
                </div>
    
                <h2>Products</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Product Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.categories
                      .map((category: Category) =>
                        category.products
                          .map(
                            (product: product) => `
                        <tr>
                          <td>${product.product_name}</td>
                          <td>${category.category_name}</td>
                          <td>${product.product_quantity}</td>
                        </tr>
                      `
                          )
                          .join('')
                      )
                      .join('')}
                  </tbody>
                </table>
    
                <div class="footer">
                  Stock Report Generated on ${new Date().toLocaleString()}
                </div>
              </div>
            </body>
          </html>
        `;

      printWindow.document.write(content);
      printWindow.document.close();

      // Optionally wait for a short delay to ensure the content is rendered
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } else {
      // Handle the case where the print window couldn't be opened
      console.error('Error opening print window');
    }
  }
}
