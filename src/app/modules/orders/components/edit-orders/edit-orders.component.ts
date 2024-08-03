import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ShiftService } from 'src/app/modules/admin/services/shift.service';
import { TableService } from 'src/app/modules/admin/services/table.service';
import { Shift } from 'src/app/modules/menu/interfaces/Shift';
import { Table } from 'src/app/modules/menu/interfaces/Tables';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { UserInterface } from 'src/app/shared/interfaces/auth.interface';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { environment } from 'src/environments/environment';
import { OrdersService } from '../../services/orders.service';
import { Orders } from 'src/app/modules/menu/interfaces/Orders';
import { product } from 'src/app/modules/menu/interfaces/products';
import { SearchService } from 'src/app/shared/services/SearchService/search.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Category } from 'src/app/modules/menu/interfaces/categories';

@Component({
  selector: 'app-edit-orders',
  templateUrl: './edit-orders.component.html',
  styleUrls: ['./edit-orders.component.scss'],
})
export class EditOrdersComponent implements OnInit {
  subTotal: number = 0;
  categories: Category[] = [];
  products: product[] = [];
  Allproducts: product[] = [];
  activeCategory: Category | null = null;
  selectedProducts: product[] = [];
  productTotals: number[] = [];
  currentUser$: Observable<UserInterface | null> | undefined;
  selectedTable: Table | null = null;
  selectedTableId: number | null = null;
  deletedItems: product[] = [];

  shift: Shift | null = null;
  selectedOrder: Orders | null = null; // Declare selectedOrder property

  orderId: any | null = null; // Declare orderId property
  dataLoaded = false;
  categoryLoading: boolean = true;
  productsLoading: boolean = true;
  clicked: boolean = false;
  originalTotal: any | null = null;
  query: string = '';
  colors = ['#CFDDDB', '#E4CDED', '#C2DBE9', '#E4CDED', '#F1C8D0', '#C9CAEF'];
  private searchQuerySubscription: Subscription | undefined;
  filteredProducts: any[] = [];
  selectedCategory: any = null;
  addItems: product[] = [];
  receivedItems: product[] = [];

  constructor(
    private menuService: MenuService,
    private http: HttpClient,
    private searchService: SearchService,
    private userService: UserService,
    private authService: AuthService,
    private tableService: TableService,
    private shiftApi: ShiftService,
    private sharedService: OrdersService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: HotToastService
  ) {
    this.categories = [];
  }

  ngOnInit() {
    this.getAllCateroies();
    this.getAllProducts();
    // this.loadCategoriesAndSetFirstCategory();
    // this.setupTableSubscription();
    this.subscribeToShiftName();
    this.selectedTable = this.tableService.getSelectedTable();
    this.currentUser$ = this.userService.getCurrentUser();

    this.sharedService.selectedOrder$.subscribe((selectedOrder) => {
      this.selectedOrder = selectedOrder;
      console.log('Order ID for Updatett:', this.selectedOrder);

      // console.log('orders selected', selectedOrder);
      this.loadOrderDetails(selectedOrder?.id); // Load details when selectedOrder is available
    });
  }

  loadOrderDetails(orderId: string | undefined) {
    console.log('Order ID for Update:', this.orderId);

    if (orderId) {
      this.menuService.getOrderDetailsById(orderId).subscribe(
        (orderDetails: any) => {
          // console.log('Order details received:', orderDetails);

          // Parse the received items from the server
          const receivedItems = orderDetails?.Items;
          this.receivedItems = receivedItems;
          console.log('Order details items:', this.receivedItems);

          this.originalTotal = parseFloat(orderDetails.Total);

          // Update existing items in selectedProducts with receivedItems
          this.selectedProducts.forEach((existingProduct) => {
            // Convert existingProduct.id to a number, assuming item.id is a number
            const existingProductId = existingProduct.id
              ? Number(existingProduct.id)
              : undefined;

            const matchingReceivedItems = receivedItems.filter(
              (item: { id: number }) => item.id === existingProductId
            );

            if (matchingReceivedItems.length > 0) {
              // Use the first matching item (if there are multiple, you might need to decide how to handle them)
              const matchingReceivedItem = matchingReceivedItems[0];
              existingProduct.selectedItems =
                matchingReceivedItem.selectedItems;
              existingProduct.product_quantity = matchingReceivedItem.quantity; // Set product_quantity
              existingProduct.id = matchingReceivedItem.id;
            } else {
              // If the item is not found in receivedItems, consider it as removed
              existingProduct.selectedItems = 0;
            }
          });

          // Add new items to selectedProducts that are present in receivedItems but not in selectedProducts
          // receivedItems.forEach(
          //   (receivedItem: {
          //     store_quantity: any;
          //     recipe_id: any;
          //     is_kitchen_product: boolean;
          //     specification: any;
          //     deleted: any;
          //     is_service: any;
          //     quantityToAdd: any;
          //     category_id: any;
          //     buying_price: any;
          //     id: number;
          //     name: any;
          //     price: any;
          //     quantity: any;
          //     selectedItems: any;
          //   }) => {
          //     // Map the properties to match the structure of existing items
          //     const newItem: product = {
          //       id: receivedItem.id.toString(), // Convert id to string
          //       product_name: receivedItem.name,
          //       product_price: receivedItem.price,
          //       product_quantity: receivedItem.quantity,
          //       store_quantity: receivedItem.store_quantity,
          //       selectedItems: receivedItem.selectedItems || 0,
          //       buying_price: receivedItem.buying_price,
          //       category_id: receivedItem.category_id,
          //       quantityToAdd: receivedItem.quantityToAdd,
          //       is_service: receivedItem.is_service,
          //       deleted: receivedItem.deleted,
          //       specification: receivedItem.specification,
          //       is_kitchen_product: receivedItem.is_kitchen_product,
          //       recipe_id: receivedItem.recipe_id,
          //       Items: '',
          //       price: undefined,
          //       name: undefined,
          //       selectedOrder: [],
          //       showDeleteIcon: false,
          //     };

          //     this.selectedProducts.push(newItem);
          //   }
          // );

          this.dataLoaded = true;
        },
        (error) => {
          console.error('Error loading order details:', error);
          this.notificationService.error('Error loading order details');
        }
      );
    }
  }

  loadCategoriesAndSetFirstCategory() {
    this.menuService.getCategories().subscribe((data: any) => {
      this.categories = data.map((category: any) => ({
        ...category,
        products: category.products.filter((product: any) => !product.deleted),
      }));
      console.log('Categories', this.categories);
      this.categories.forEach((category) => {
        category.num_products = category.products.length;
      });
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
        console.log('Filtered Categories', this.categories);
        this.assignColorsToCategories();
      });
    }
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
      console.log('All products querried', this.Allproducts);
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
    console.log('category len for colors', numCategories);
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
    // if the select
    // Check if the product is a service (not countable)
    if (product.is_service) {
      // For service products, allow incrementing even if it's zero
      product.selectedItems = (product.selectedItems || 0) + 1;
      // this.addToSelectedProducts(product);
      this.addToNewSelectedProducts(product);
      this.selectedProductsTotal(); // Recalculate total after modification;        console.log('SELECTED ITEMS', this.selectedProducts);

      // Update selectedProductsToPrint after modifying selectedProducts
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
        product.product_quantity = String(Number(product.product_quantity) - 1);
        // this.addToSelectedProducts(product);
        this.addToNewSelectedProducts(product);
        this.selectedProductsTotal(); // Recalculate total after modification;

        // Check if quantity is zero
        if (Number(product.product_quantity) === 0) {
          this.notificationService.error('Sorry, this product is out of stock');
        }
      } else {
        this.notificationService.error('Sorry, this product is out of stock');
      }
    }
  }

  decrementItem(product: product) {
    if (product.selectedItems && product.selectedItems > 0) {
      product.selectedItems -= 1;
      if (product.product_quantity) {
        product.product_quantity = String(Number(product.product_quantity) + 1);
      }
      // this.addToSelectedProducts(product);
      this.selectedProductsTotal(); // Recalculate total after modification
      this.addToNewSelectedProducts(product);
      // Check if product quantity becomes zero after decrement
      if (Number(product.selectedItems) === 0) {
        // Remove the product from selectedProducts array
        const index = this.addItems.findIndex((p) => p.id === product.id);
        if (index !== -1) {
          this.addItems.splice(index, 1);
          // this.addItems.splice(index, 1);
        }
      }
    }
  }

  addToSelectedProducts(product: product) {
    const productId = product.id;

    // Check if the product already exists in selectedProducts
    const existingProduct = this.selectedProducts.find(
      (p) => p.id === productId
    );

    if (existingProduct) {
      // If the product exists, update its selectedItems
      const ext = existingProduct.selectedItems;
      existingProduct.selectedItems =
        existingProduct.selectedItems! + product.selectedItems!;
      console.log('existingProduct selected items', ext);
      console.log('nw added selected items', product.selectedItems);
      console.log('tottal selected items now', existingProduct.selectedItems);
    } else {
      // If the product doesn't exist, add it to selectedProducts
      this.selectedProducts.push(product);
    }

    // Check if the selectedOrder is defined and Items is an array
    if (this.selectedOrder && Array.isArray(this.selectedOrder.Items)) {
      // Convert the ID to a number for comparison
      const existingItemIndex = this.selectedOrder.Items.findIndex(
        (item) => parseInt(item.id, 10) === productId
      );

      if (existingItemIndex !== undefined && existingItemIndex !== -1) {
        // If the product exists in the Items array, update its selectedItems
        this.selectedOrder.Items[existingItemIndex].selectedItems =
          product.selectedItems;
      } else {
        // If the product doesn't exist in the Items array, add it
        const newItem = {
          id: productId.toString(), // Convert back to string if needed
          name: product.product_name,
          price: product.product_price,
          selectedItems: product.selectedItems,
        };

        this.selectedOrder.Items.push(newItem);
      }
    }
  }

  addToNewSelectedProducts(product: product) {
    // Check if the product is already in the array
    const index = this.addItems.findIndex((p) => p.id === product.id);

    const totalPrice =
      parseFloat(product.product_price) * (product.selectedItems || 0) || 0;

    if (index !== -1) {
      // If the product is already in the array, update its selectedItems
      this.addItems[index].selectedItems = product.selectedItems;
      console.log('newlly added items to selected products', this.addItems);
      // Update the total for this product in the productTotals array
      this.productTotals[index] = totalPrice;
    } else {
      // If the product is not in the array, add it
      this.addItems.push(product);
      // Add the total for this new product to the productTotals array
      this.productTotals.push(totalPrice);
      console.log('newlly added items to selected products', this.addItems);
    }
  }

  selectedProductsTotal(): number {
    return this.addItems.reduce((total, product) => {
      const price = parseFloat(product.product_price);
      const quantity = product.selectedItems || 0;
      return total + price * quantity;
    }, 0);
  }

  newSelectedProductsTotal(): number {
    return this.addItems.reduce((total, product) => {
      const price = parseFloat(product.product_price);
      const quantity = product.selectedItems || 0;
      return total + price * quantity;
    }, 0);
  }

  deleteItem(receiptItem: product) {
    const index = this.addItems.findIndex((p) => p.id === receiptItem.id);
    if (index !== -1) {
      // Remove the item from selectedProducts
      const deletedItem = this.addItems.splice(index, 1)[0];

      // Add the deleted item to the deletedItems array
      this.deletedItems.push(deletedItem);
      console.log('deleted items', this.deletedItems);
      receiptItem.selectedItems = 0;
    }
  }

  clearDeletedItems() {
    this.deletedItems = [];
  }

  removeTheQuantityofItems() {
    const itemsToUpdateQuantity = this.addItems.map((product) => ({
      categoryId: product.category_id, // Assuming you have categoryId in your product object
      productId: product.id,
      productData: {
        product_quantity: +product.product_quantity,
      },
    }));
    itemsToUpdateQuantity.forEach((item) => {
      this.menuService
        .updateProduct(item.productId, item.productData)
        .subscribe(
          () => {
            // Successfully updated product quantity
          },
          (error) => {
            console.error('Error updating product quantity:', error);
            this.notificationService.error('Failed To Update Product Quantity');
          }
        );
    });
  }

  onMouseEnter(product: product) {
    product.showDeleteIcon = true;
  }

  onMouseLeave(product: product) {
    // Only set showDeleteIcon to false if the item is newly added (not existing in the order)
    product.showDeleteIcon = !this.isExistingItem(product);
  }

  isExistingItem(product: product): boolean {
    // Check if the product already exists in the order (selectedProducts)
    const existingProduct = this.selectedProducts.find(
      (item) => item.id === product.id
    );
    console.log('existing Items ', existingProduct);

    // If the product is found in selectedProducts, it's an existing item
    return !!existingProduct;
  }

  updateOrder() {
    this.clicked = true;
    console.log('received Items', this.receivedItems);

    // Create a Map to store unique items by their id
    const itemsMap = new Map();

    // Process receivedItems
    this.receivedItems.forEach((item) => {
      itemsMap.set(item.id, {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.product_quantity || null,
        selectedItems: item.selectedItems || 0,
      });
    });

    // Process addItems
    this.addItems.forEach((product) => {
      const existingItem = itemsMap.get(product.id);
      if (existingItem) {
        // Item already exists, sum up selectedItems
        existingItem.selectedItems += product.selectedItems || 0;
        // Update quantity if it's available in addItems
        if (product.product_quantity !== undefined) {
          existingItem.quantity = product.product_quantity;
        }
      } else {
        // New item, add it to the Map
        itemsMap.set(product.id, {
          id: product.id,
          name: product.product_name,
          price: product.product_price,
          quantity: product.product_quantity || null,
          selectedItems: product.selectedItems || 0,
        });
      }
    });

    // Convert Map values to array to get the final list of items
    const itemsToPost = Array.from(itemsMap.values());

    console.log('Items to Post:', itemsToPost);
    this.orderId = this.selectedOrder?.id;
    console.log('Order ID for Update:', this.orderId);

    if (this.orderId) {
      const updatedOrderData = {
        TableName: this.selectedTable?.name || 'Table 1',
        ShiftID: this.selectedOrder?.ShiftID,
        Items: itemsToPost,
        Total: this.selectedProductsTotal() + this.originalTotal, // Use the total calculation method
        Served_by: this.selectedOrder?.Served_by, // Change this to the actual server or user information
      };

      console.log(
        'Updated Order Data items to update:',
        updatedOrderData.Items
      );

      // Log the URL to verify if it includes the correct order ID
      const apiUrl = `https://backend.c-pos.co.ke/api/orders/${this.orderId}`;
      // console.log('API URL:', apiUrl);

      this.menuService.updateOrder(this.orderId, updatedOrderData).subscribe(
        (response) => {
          this.removeTheQuantityofItems();
          this.postDataToPrint(this.addItems);
          this.clicked = false;

          console.log('Update Order Success:', response);
          this.notificationService.success('Order updated');
          this.router.navigate(['/orders/orders-main']);
        },
        (error) => {
          console.error('Update Order Error:', error);
          this.notificationService.error('Order failed to update', error);
        }
      );
    } else {
      // Handle the case where orderId is not available
      console.error('Order ID is not available for update');
    }
  }

  clearSelectedItems() {
    this.selectedProducts = [];
    this.productTotals = [];
    this.selectedTable = null;
  }
  selectTable(table: Table) {
    this.tableService.setSelectedTable(table);
  }
  private subscribeToShiftName() {
    this.shiftApi.currentShift$.subscribe((shift) => {
      this.shift = shift;
    });
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

  postDataToPrint(selectedProductsToPrint: any) {
    // const url = 'http://localhost/C-POS-Printer-API/public/api/receipts';
    // const url = 'http://127.0.0.1:8000/api/receipts';
    console.log('items received for printing', selectedProductsToPrint);
    const itemsToSend = this.addItems.map((product) => ({
      name: product.product_name,
      id: product.id,
      price: product.product_price,
      selectedItems: product.selectedItems, // Ensure selectedItems is properly updated
    }));

    const servedBy = this.selectedOrder?.Served_by;

    const data = {
      TableName: this.selectedTable?.name || 'Table 1',
      served_by: servedBy,
      Items: itemsToSend,
      Total: this.newSelectedProductsTotal(),
      time: new Date().toISOString(),
      ShiftID: this.selectedOrder?.ShiftID,
      Served_by: this.selectedOrder?.Served_by,
      orderId: this.selectedOrder?.id,
      printerIp: this.selectedOrder?.printerIp,
    };

    console.log('data send to print', data);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.menuService.createUpdateOrders(data).subscribe(
      (response) => {
        console.log(
          'Data posted successfully for creating updated orders!',
          response
        );
        // Handle success response here
      },
      (error) => {
        console.error('Error posting data for updating orders:', error);
        // Handle error response here
      }
    );
  }
}
