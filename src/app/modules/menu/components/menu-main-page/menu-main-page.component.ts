import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Category } from '../../interfaces/categories';
import { product } from '../../interfaces/products';
import { menuItem } from '../../interfaces/menuItems.interface';
import { TableSelectionService } from 'src/app/shared/services/tables-selection/table-selection.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { UserInterface } from 'src/app/shared/interfaces/auth.interface';
import { Observable, Subscription, catchError, from, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Shift } from '../../interfaces/Shift';
import { ShiftService } from 'src/app/modules/admin/services/shift.service';
import { Table } from '../../interfaces/Tables';
import { TableService } from 'src/app/modules/admin/services/table.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'jquery';
import { SearchService } from 'src/app/shared/services/SearchService/search.service';
import { HotToastService } from '@ngneat/hot-toast';
import { OrderCommunicationService } from 'src/app/modules/orders/services/order-communication.service';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import {
  OrgOptionsInterface,
  OrganizationInterface,
} from 'src/app/shared/interfaces/organization.interface';
import { MigrationService } from 'src/app/shared/services/migration/migration.service';
import { endpointsData } from 'src/app/shared/data/migration.data';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
@Component({
  selector: 'app-menu-main-page',
  templateUrl: './menu-main-page.component.html',
  styleUrls: ['./menu-main-page.component.scss'],
})
export class MenuMainPageComponent implements OnInit {
  receiptItems: menuItem[] = [];
  subTotal: number = 0;
  total: number = 0;
  categories: Category[] = [];
  activeCategory: Category | null = null;
  selectedProducts: product[] = [];
  products: product[] = [];
  Allproducts: product[] = [];
  selectedProductsToPrint: any[] = [];
  productTotals: number[] = [];
  currentUser$: Observable<UserInterface | null> | undefined;
  selectedTable: Table | null = null;
  selectedTableId: number | null = null;
  shift: Shift | null = null;
  query: string = '';
  colors = ['#CFDDDB', '#E4CDED', '#C2DBE9', '#E4CDED', '#F1C8D0', '#C9CAEF'];
  private searchQuerySubscription: Subscription | undefined;
  filteredProducts: any[] = [];
  selectedCategory: any = null;
  loggedinUser: string = '';
  comments: string = '';
  advancedOrderId: number | null = null;
  orderIdToPrint: any;
  totalToPrint: any;
  incredients: any;
  recipe: any;
  clicked: boolean = false;
  categoryLoading: boolean = true;
  productsLoading: boolean = true;
  showSubmitOrder: boolean = false;

  apiUrl: string = '';
  savedOrg: OrganizationInterface | null = null;

  orgOptions: OrgOptionsInterface | null = null;

  constructor(
    private menuService: MenuService,
    private adminService: AdminService,
    private orderCommunicationService: OrderCommunicationService,
    private http: HttpClient,
    private searchService: SearchService,
    private userService: UserService,
    private authService: AuthService,
    private tableService: TableService,
    private toast: HotToastService,
    private shiftApi: ShiftService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: HotToastService,
    private localStorageService: LocalStorageService,

    // TODO:: DELETE AFTER MIGRATION
    private migrationService: MigrationService
  ) {
    this.getOrgOptions();
    this.fetchOrganizationInfo();
    this.categories = [];
    this.assignColorsToCategories(); // Call the method to assign colors
    this.getAllCateroies();
  }

  // TODO:: DELETE AFTER MIGRATION
  migrate() {
    this.migrationService.migrate(endpointsData).then((res) => {
      console.log(res);
    });
  }
  private fetchOrganizationInfo() {
    const companyInfoString = this.localStorageService.getItem('companyInfo');
    this.savedOrg = companyInfoString ? JSON.parse(companyInfoString) : null;
    // console.log('company Infor', this.savedOrg);

    if (!this.savedOrg || !this.savedOrg.id) {
      console.error('companyInfo is invalid or does not have an id property');
      return;
    }

    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg.id}`;
    // console.log('api url link', this.apiUrl);
  }

  ngOnInit() {
    // TODO:: DELETE AFTER MIGRATION
    // this.migrate();

    this.getAllCateroies();
    this.getAllProducts();
    this.route.params.subscribe((params) => {
      // Retrieve the order ID from the route parameters
      const orderIdFromRoute = +params['orderId'];

      // Use the order ID from the route parameters if it's a valid number
      if (!isNaN(orderIdFromRoute)) {
        this.advancedOrderId = orderIdFromRoute;
      } else {
        // Retrieve the order ID from the OrderCommunicationService
        this.advancedOrderId = this.orderCommunicationService.getOrderId();
      }
    });

    // this.setupTableSubscription();
    this.subscribeToShiftName();
    this.selectedTable = this.tableService.getSelectedTable();
    this.selectedTableId = this.selectedTable!.id;
    // console.log('selected table',this.selectedTableId)
    this.currentUser$ = this.userService.getCurrentUser();
    this.subscribeToSearchQueryChanges();
    this.getAllRecipe();
    this.getAllIncredients();
    this.getAllOrgs();
  }
  getOrgOptions() {
    this.adminService.orgOptions$.subscribe((org) => {
      this.orgOptions = org;
    });

    // const orgOptionsString = localStorage.getItem('orgOptions');
    // if (orgOptionsString) {
    //   this.orgOptions = JSON.parse(orgOptionsString);
    //   console.log(
    //     'Organization options found in local storage',
    //     this.orgOptions
    //   );
    // } else {
    //   console.log('Organization options not found in local storage');
    // }
  }

  loadCategoriesAndSetFirstCategory() {
    this.menuService.getCategories().subscribe((data: any) => {
      this.categories = data.map((category: any) => ({
        ...category,
        products: category.products
          .filter((product: any) => !product.deleted)
          .map((product: any) => ({
            ...product,
            specification: JSON.parse(product.specification), // Parse the specification string into an array
          })),
      }));
      // console.log('Categories', this.categories);
      // this.categories.forEach((category) => {
      //   category.num_products = category.products.length;
      // });
      this.assignColorsToCategories();
    });
  }
  getAllCateroies() {
    this.menuService.getCategories().subscribe((data: any) => {
      // Assuming 'data' is an array of categories fetched from the server
      this.categories = data;
      this.categoryLoading = false;
      console.log('All categories', this.categories);
      this.getCategoriesProducts(data[0].id);
      // this.paginateCategories();
      this.assignColorsToCategories();
    });
  }

  filterCategories() {
    if (this.query.trim() === '') {
      this.loadCategoriesAndSetFirstCategory(); // Load all categories if the query is empty
    } else {
      const lowercaseQuery = this.query.toLowerCase();
      this.menuService.getCategories().subscribe((data: any) => {
        this.categories = data
          .map((category: any) => ({
            ...category,
            products: category.products
              .filter((product: any) =>
                product.product_name.toLowerCase().includes(lowercaseQuery)
              )
              .filter((product: any) => !product.deleted),
          }))
          .filter(
            (category: any) =>
              category.category_name.toLowerCase().includes(lowercaseQuery) ||
              category.products.length > 0 // Filter categories with matching products
          );
        // console.log('Filtered Categories', this.categories);
        this.assignColorsToCategories();
      });
    }
  }

  getCategoriesProducts(id: string) {
    this.menuService.getCategoriesProducts(id).subscribe((data) => {
      this.products = data;
      this.productsLoading = false;
    });
  }
  getAllProducts() {
    this.productsLoading = true;
    this.menuService.getAllProducts().subscribe((data) => {
      this.Allproducts = data;
      if (this.query.trim() != '')
        this.products = this.Allproducts.filter((product: any) =>
          product.product_name.toLowerCase().includes(this.query.toLowerCase())
        );
      if (this.query.trim() == '') {
        this.getCategoriesProducts(this.categories[0].id);
      }
      this.productsLoading = false;
      // this.productsLoading = false;
    });
  }
  getNumberOfProducts(categoryId: string): number {
    const numberOfProducts = this.Allproducts.filter(
      (product: any) => product.category_id == categoryId
    ).length;
    if (numberOfProducts > 0) {
      return numberOfProducts;
    } else {
      return 0;
    }
  }

  assignColorsToCategories() {
    const numCategories = this.categories.length;
    // console.log('category len for colors',numCategories)
    for (let i = 0; i < numCategories; i++) {
      const colorIndex = i < this.colors.length ? i : i % this.colors.length;
      this.categories[i].color = this.colors[colorIndex];
    }
  }
  displayProductsByCategory(category: Category) {
    const products = category.products;
    // console.log('Products for category:', category.category_name);
    products.forEach((product, index) => {
      // console.log(`Product ${index + 1}:`, product);
    });
  }

  setActiveCategory(category: Category) {
    this.activeCategory = category;
    this.query = '';
    console.log('Active Category', this.activeCategory);
  }

  incrementItem(product: product) {
    if (
      this.selectedTable ||
      this.advancedOrderId ||
      !this.orgOptions?.has_tables
    ) {
      // Check if the product is a service (not countable)
      if (product.is_service) {
        // For service products without a recipe, allow incrementing even if it's zero
        product.selectedItems = (product.selectedItems || 0) + 1;
        this.addToSelectedProducts(product);
        this.selectedProductsToPrint = [...this.selectedProducts];
      } else {
        // For countable products
        if (product.product_quantity && Number(product.product_quantity) > 0) {
          // Check if quantity is less than 5
          if (Number(product.product_quantity) <= 5) {
            this.notificationService.info(
              'Running low on ' + product.product_name
            );
          }

          product.selectedItems = (product.selectedItems || 0) + 1;
          product.product_quantity = String(
            Number(product.product_quantity) - 1
          );
          this.addToSelectedProducts(product);
          console.log('SELECTED ITEMS', this.selectedProducts);

          // Check if quantity is zero
          if (Number(product.product_quantity) === 0) {
            this.notificationService.error(
              'Sorry, this product is out of stock'
            );
          }

          // Update selectedProductsToPrint after modifying selectedProducts
          this.selectedProductsToPrint = [...this.selectedProducts]; // Sync the arrays
          console.log(
            'Products selected for printing',
            this.selectedProductsToPrint
          );
        } else {
          this.notificationService.error('Sorry, this product is out of stock');
        }
      }
    } else {
      this.toast.info('Select Table First');
      return;
    }
  }

  // Check if there are sufficient quantities of ingredients for a countable product
  checkProductQuantity(product: product): boolean {
    const ingredientInfo = this.incredients.find(
      (i: any) => i.id === this.recipe.ingredients.id
    );
    console.log('Incredients Required', ingredientInfo);

    return (
      ingredientInfo &&
      ingredientInfo.quantity >= Number(product.product_quantity)
    );
  }

  // Check if there are sufficient quantities of ingredients for a recipe
  checkIngredientQuantities(ingredients: any[]): boolean {
    let hasInsufficientQuantity = false;

    for (const ingredient of ingredients) {
      const ingredientInfo = this.incredients.find(
        (i: any) => i.id === ingredient.id
      );

      if (ingredientInfo && ingredientInfo.quantity < ingredient.quantity) {
        hasInsufficientQuantity = true;
        break;
      }
    }

    return !hasInsufficientQuantity;
  }

  decrementItem(product: product) {
    if (!product.selectedItems && product.selectedItems! < 0) {
      // this.notificationService.error('Select Table First');
      return;
    }

    if (product.selectedItems && product.selectedItems > 0) {
      product.selectedItems -= 1;
      if (product.product_quantity) {
        product.product_quantity = String(Number(product.product_quantity) + 1);
      }

      // If the item reaches zero selectedItems, remove it
      if (product.selectedItems === 0) {
        this.removeFromSelectedProducts(product);
      } else {
        // Update the existing item's selectedItems
        this.updateSelectedProducts(product);
        // console.log('SELECTED ITEMS', this.selectedProducts);
      }

      // Update selectedProductsToPrint after modifying selectedProducts
      this.selectedProductsToPrint = [...this.selectedProducts]; // Sync the arrays
      // console.log('Products selected for printing', this.selectedProductsToPrint);
    } else {
      // this.notificationService.showError('Select Table First');
    }
  }

  updateSelectedProducts(product: product) {
    const index = this.selectedProducts.findIndex((p) => p.id === product.id);

    if (index !== -1) {
      // Update the selectedItems for the existing product
      this.selectedProducts[index].selectedItems = product.selectedItems;
      const totalPrice =
        parseFloat(product.product_price) * (product.selectedItems || 0) || 0;
      this.productTotals[index] = totalPrice;
    }
  }

  removeFromSelectedProducts(product: product) {
    const index = this.selectedProducts.findIndex((p) => p.id === product.id);

    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
      this.productTotals.splice(index, 1);
    }
  }

  addToSelectedProducts(product: product) {
    // Check if the product is already in the array
    const index = this.selectedProducts.findIndex((p) => p.id === product.id);

    const totalPrice =
      parseFloat(product.product_price) * (product.selectedItems || 0) || 0;

    if (index !== -1) {
      // If the product is already in the array, update its selectedItems
      this.selectedProducts[index].selectedItems = product.selectedItems;
      // Update the total for this product in the productTotals array
      this.productTotals[index] = totalPrice;
    } else {
      // If the product is not in the array, add it
      this.selectedProducts.push(product);
      // Add the total for this new product to the productTotals array
      this.productTotals.push(totalPrice);
    }

    this.selectedProductsToPrint = [...this.selectedProducts]; // Update selectedProductsToPrint
    // console.log('Products selected for printing', this.selectedProductsToPrint);
  }

  get selectedProductsTotal(): number {
    return this.selectedProducts.reduce((total, product) => {
      const price = parseFloat(product.product_price);
      const quantity = product.selectedItems || 0;
      return total + price * quantity;
    }, 0);
  }

  calculateTotalPrice(): number {
    console.log('Products selected ', this.selectedProductsToPrint);

    const total = this.selectedProductsToPrint.reduce((sum, product) => {
      const itemTotal = product.selectedItems * product.product_price;
      return sum + itemTotal;
    }, 0);

    return total;
  }

  deleteItem(receiptItem: any) {
    // Set the quantity to 0
    receiptItem.selectedItems = 0;
    console.log('Items Sent to print', this.selectedProducts);

    // Remove the deleted item from selectedProducts
    const index = this.selectedProducts.findIndex(
      (p) => p.id === receiptItem.id
    );
    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
      console.log('Items remaining after delete', this.selectedProducts);
    }
  }

  resetSelectedItems() {
    this.selectedProducts.forEach((product) => {
      product.selectedItems = 0;
    });
    // console.log('selected prooooo',this.selectedProducts)
  }

  decreaseOrDecreaseOrder() {
    // Your implementation for decreasing or increasing orders
  }

  postSelectedItemsToBackend() {
    this.clicked = true;
    if (this.selectedProducts.length === 0) {
      this.notificationService.error('Select items to place an order');
      this.clicked = false;
      return;
    }

    this.shiftApi.currentShift$.subscribe((shift: Shift | null) => {
      if (!shift) {
        this.notificationService.error('Start Shift First');
        this.clicked = false;
        return;
      }

      this.authService.getCurrentUser().subscribe((user) => {
        if (user) {
          const servedBy = user.username;
          this.loggedinUser = user.fullName;

          const itemsToUpdateQuantity = this.selectedProducts.map(
            (product) => ({
              categoryId: product.category_id, // Assuming you have categoryId in your product object
              productId: product.id,
              productData: {
                product_quantity: +product.product_quantity,
              },
            })
          );

          itemsToUpdateQuantity.forEach((item) => {
            this.menuService
              .updateProduct(item.productId, item.productData)
              .subscribe(
                () => {
                  // Successfully updated product quantity
                },
                (error) => {
                  console.error('Error updating product quantity:', error);
                  this.notificationService.error(
                    'Failed To Update Product Quantity'
                  );
                }
              );
          });

          const itemsToSend = this.selectedProducts.map((product) => ({
            name: `${product.product_name} ${
              product.selectedSpecification || ''
            }`, // Concatenate name and specification
            id: product.id,
            category_id: product.category_id,
            price: product.product_price,
            selectedItems: product.selectedItems || 0,
            specification: product.specification,
            is_kitchen_product: product.is_kitchen_product || false,
          }));

          // console.log('Items send to printo server', itemsToSend);

          const order = {
            TableName: this.selectedTable?.name || 'Table 1',
            ShiftID: shift.id,
            Items: itemsToSend,
            Total: this.calculateTotalPrice(),
            Served_by: servedBy,
            paymentMode: 'Cash',
            amountPaid: 0,
            comments: this.comments,
            Cash_paid: 0,
            Mpesa_paid: 0,
            Bank_paid: 0,
            Voucher_amount: 0,
            Complimentary_amount: 0,
            Is_complete: false,
          };

          this.http
            .post(`${this.apiUrl}/orders`, order)
            .pipe(
              catchError((error) => {
                console.error('Error posting order:', error);
                return of(null);
              })
            )
            .subscribe((response: any) => {
              if (response) {
                this.orderIdToPrint = response.id;
                this.totalToPrint = response.Total;
                // console.log('Order posted id response', this.orderIdToPrint);
                this.clearSelectedItems();
                this.notificationService.success('Order Posted');
                this.postDataToPrint(itemsToSend);
                this.clicked = false;
                this.logoutUser();

                // console.log('Table marked as occupied', this.selectedTable);

                if (this.selectedTableId) {
                  // console.log('Table marked as occupied', this.selectedTableId);

                  this.tableService
                    .markTableAsOccupied(this.selectedTableId)
                    .subscribe(() => {
                      // console.log('Table marked as occupied');
                      // You can perform additional actions or update UI here
                    });
                } else {
                  // console.log('Failed to mark the table cleared', error);
                }

                // this.printOrder(order);
              } else {
                this.notificationService.error('Failed To Post Order');
              }
            });
        } else {
          this.notificationService.error('User information not found');
        }
      });
    });
  }

  postAvanceOrderToBackend() {
    if (this.selectedProducts.length === 0) {
      this.notificationService.error('Select items to place an order');
      return;
    }

    this.shiftApi.currentShift$.subscribe((shift: Shift | null) => {
      if (!shift) {
        this.notificationService.error('Start Shift First');
        return;
      }

      this.authService.getCurrentUser().subscribe((user) => {
        if (user) {
          const servedBy = user.username;
          this.loggedinUser = user.fullName;

          // const itemsToUpdateQuantity = this.selectedProducts.map((product) => ({
          //   categoryId: product.category_id, // Assuming you have categoryId in your product object
          //   productId: product.id,
          //   productData: {
          //     product_quantity: product.product_quantity
          //   }
          // }));

          // itemsToUpdateQuantity.forEach((item) => {
          //   this.menuService.updateProduct(item.categoryId, item.productId, item.productData)
          //     .subscribe(
          //       () => {
          //         // Successfully updated product quantity
          //       },
          //       (error) => {
          //         console.error('Error updating product quantity:', error);
          //         this.notificationService.error('Failed To Update Product Quantity');
          //       }
          //     );
          // });

          const itemsToSend = this.selectedProducts.map((product) => ({
            name: `${product.product_name} ${
              product.selectedSpecification || ''
            }`, // Concatenate name and specification
            id: product.id,
            category_id: product.category_id,
            price: product.product_price,
            selectedItems: product.selectedItems || 0,
            specification: product.specification,
          }));
          const itemsJson = JSON.stringify(itemsToSend);

          // console.log('Items send to printo server', itemsJson);

          const order = {
            shift_id: '0',
            items: itemsJson,
            Total: this.calculateTotalPrice(),
            waiters_name: servedBy,
            paymentMode: 'Cash',
            amountPaid: 0,
            comments: this.comments,
            Cash_paid: '0',
            Mpesa_paid: '0',
            Bank_paid: '0',
            Voucher_amount: 0,
            Complimentary_amount: 0,
            is_complete: false,
            balance: 0 - this.calculateTotalPrice(),
          };
          // console.log('order to advance table',order)

          this.http
            .put(`${this.apiUrl}/advance-orders/${this.advancedOrderId}`, order)
            .pipe(
              catchError((error) => {
                console.error('Error posting order:', error);
                return of(null);
              })
            )
            .subscribe((response) => {
              if (response) {
                this.clearSelectedItems();
                this.notificationService.success(
                  'Advanced Order  Posted Successfully'
                );
                this.postDataToPrint(this.selectedProductsToPrint);
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['/menu/main-page']);
                this.router.navigate(['/orders/show_advaced_orders']);
                this.advancedOrderId = null;
                console.log('checking advanced order id', this.advancedOrderId);
                this.loadCategoriesAndSetFirstCategory();
                this.logoutUser();
                // console.log('Table marked as occupied', this.selectedTable);

                // this.printOrder(order);
              } else {
                this.notificationService.error('Failed To Post Order');
              }
            });
        } else {
          this.notificationService.error('User information not found');
        }
      });
    });
  }

  postDataToPrint(selectedProductsToPrint: any) {
    const url = 'http://localhost/C-POS-Printer-API/public/api/receipts';
    // const url = 'http://127.0.0.1:8000/api/receipts';
    console.log('items received for printing', selectedProductsToPrint);
    const itemsToSend = this.selectedProductsToPrint.map((product) => ({
      name: product.product_name,
      id: product.id,
      price: product.product_price,
      selectedItems: product.selectedItems, // Ensure selectedItems is properly updated
    }));

    const servedBy = this.loggedinUser;

    const data = {
      table_name: this.selectedTable?.name || 'Table 1',
      served_by: servedBy,
      items: JSON.stringify(selectedProductsToPrint),
      total: this.totalToPrint,
      time: new Date().toISOString(),
      organization_name: 'Demo',
      till_number: '1234567890',
      order_id: this.orderIdToPrint,
    };

    console.log('data send to print', data);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(url, data, { headers }).subscribe(
      (response) => {
        console.log('Data posted successfully!', response);
        // Handle success response here
        this.resetSelectedItems();
        this.logoutUser();
      },
      (error) => {
        console.error('Error posting data:', error);
        // Handle error response here
      }
    );
  }

  clearSelectedItems() {
    this.selectedProducts = [];
    this.productTotals = [];
    this.selectedTable = null;
  }
  selectTable(table: Table) {
    // Store the selected table in local storage
    this.tableService.setSelectedTable(table);
  }
  private subscribeToShiftName() {
    this.shiftApi.currentShift$.subscribe((shift) => {
      this.shift = shift;
    });
  }

  printOrder(order: any) {
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      const {
        TableName,
        ShiftID,
        Total,
        Served_by,
        paymentMode,
        amountPaid,
        Items,
      } = order;

      const content = `
        <html>
          <head>
            <title>Customer Order</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
  
              .logo img {
                max-width: 100%;
                height: auto;
              }
  
              .contact-info {
                margin-top: 10px;
                font-size: 14px;
              }
  
              .contact-info p {
                margin: 5px 0;
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
  
              .summary {
                margin-top: 20px;
                font-size: 16px;
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
                <div class="logo">
                  <!-- Add your business logo or name here -->
                  <img src="your-logo-path" alt="Business Logo">
                  <h1>C-POS</h1>
                </div>
                <h2>Demo Order</h2>
              </div>
  
              <div class="contact-info">
                <p>Lancola Tech</p>
                <p>Contact Info:</p>
                <p>Address: Eldoret, Phone: 0708780772, Email: support@lancolatech.com</p>
              </div>
  
              <p>Table Name: ${TableName}</p>
              <p>Served by: ${Served_by}</p>
  
              <h2>Items</h2>
              <table>
                <thead>
                  <tr>
                    <th>ITEMS</th>
                    <th>QTY</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${Items.map(
                    (item: any) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.selectedItems}</td>
                      <td>${item.price}</td>
                    </tr>
                  `
                  ).join('')}
                </tbody>
              </table>
  
              <div class="summary">
                <p>Subtotal: ${Total * 0.9}</p>
                <p>VAT: ${Total * 0.1}</p>
                <p>Total Price: ${Total}</p>
              </div>
  
              <div class="footer">
                Thank you for your business
              </div>
            </div>
          </body>
        </html>
      `;

      printWindow.document.write(content);
      printWindow.document.close();

      // You can optionally wait for a short delay to ensure the content is rendered
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    } else {
      // Handle the case where the print window couldn't be opened
      console.error('Error opening print window');
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
    if (this.query) {
      this.filteredProducts = this.categories.flatMap((category) =>
        category.products.filter((product) =>
          product.product_name.toLowerCase().includes(this.query.toLowerCase())
        )
      );
      console.log('searched products', this.filteredProducts);
    }
  }

  getAllIncredients() {
    this.adminService.getIngredient().subscribe((data: any) => {
      this.incredients = data;
    });
  }
  getAllRecipe() {
    this.adminService.getAllRecipe().subscribe((data: any) => {
      this.recipe = data;
    });
  }

  logoutUser(): void {
    this.authService.logout();
  }

  getAllOrgs() {
    this.menuService.getAllTakeOutOrg().subscribe((data: any) => {
      console.log('All Orginazitions dddd', data);
    });
  }
  showOrderdItems() {
    this.showSubmitOrder = true;
  }
  UnshowOrderdItems() {
    this.showSubmitOrder = false;
  }
}
