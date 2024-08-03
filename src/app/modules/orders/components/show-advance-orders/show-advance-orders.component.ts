import { Component, OnInit } from '@angular/core';
import { UserInterface } from 'src/app/shared/interfaces/auth.interface';
import { OrdersService } from '../../services/orders.service';
import { ShiftService } from 'src/app/modules/admin/services/shift.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { catchError, forkJoin, of } from 'rxjs';
import { Orders } from 'src/app/modules/menu/interfaces/Orders';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { el } from 'date-fns/locale';
import { MenuService } from 'src/app/modules/menu/services/menu.service';

@Component({
  selector: 'app-show-advance-orders',
  templateUrl: './show-advance-orders.component.html',
  styleUrls: ['./show-advance-orders.component.scss'],
})
export class ShowAdvanceOrdersComponent implements OnInit {
  orders: any[] = [];
  items: [] = [];
  activeTab = 'tab1';
  isSlideOverHidden = true;
  isPaymentInput: string = 'input';
  selectedOrderId: any;
  currentShiftId: any;
  balance: any;
  advanceOrder: any;
  advanceOrderItems: any;
  itemsArray: any[] = [];
  formData: any = {
    field: '7',
  };
  currentUser: UserInterface | null = null;

  constructor(
    private menuService: OrdersService,
    private menuuService: MenuService,
    private userService: UserService,
    private shiftService: ShiftService,
    private orderService: OrdersService,
    private notificationService: HotToastService,
    private router: Router
  ) {
    this.showPostedOrders();
  }
  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log('Current User:', this.currentUser);

      // Proceed to load orders based on the user's role
    });

    this.checkForOpenShift();
    this.showPostedOrders();
  }

  checkForOpenShift(): void {
    this.shiftService.currentShift$.subscribe((shift: any) => {
      if (shift) {
        this.currentShiftId = shift.id;
        // console.log('Current Shift',this.currentShiftId);
      }
    });
  }

  showPostedOrders() {
    this.shiftService.currentShift$.subscribe((currentShift) => {
      if (currentShift && this.currentUser) {
        const id = currentShift.id;
        if (this.currentUser.role === 'Admin') {
          this.menuService.getAdvanceOrders().subscribe((data: any[]) => {
            // console.log('Ordersdddd:', data);

            // Assuming 'deleted' property is available in the response
            this.orders = data.filter(
              (order: any) => !order.is_complete && !order.deleted
            );

            this.sortOrdersById();

            // console.log('Orders:', this.orders);
          });
        } else if (this.currentUser.role === 'WAITER') {
          this.menuService.getAdvanceOrders().subscribe((data: any[]) => {
            // Assuming 'deleted' property is available in the response
            this.orders = data.filter(
              (order: any) =>
                order.waiters_name === this.currentUser!.username &&
                !order.Is_complete &&
                !order.deleted
            );

            this.sortOrdersById();
          });
        }
      }
    });
  }
  parseOrderItems(itemsString: string): any[] {
    try {
      // Check if itemsString is empty or null
      if (!itemsString) {
        return [];
      }

      return JSON.parse(itemsString);
    } catch (error) {
      console.error('Error parsing order items:', error);
      return [];
    }
  }

  sortOrdersById(): void {
    this.orders = this.orders.sort((a, b) => {
      const idA = a.id; // Replace 'id' with the correct property name
      const idB = b.id; // Replace 'id' with the correct property name
      return idB - idA;
    });

    // Additional code for parsing order items and logging sorted orders
    // for (const order of this.orders) {
    //   order.OrderItems = JSON.parse(order.Items);
    // }
    console.log('Filtered and sorted orders:', this.orders);
  }

  deleteOrder(orderId: number): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.menuService
        .deleteAdvancedOrder(orderId)
        .pipe(
          catchError((error) => {
            console.error('Error deleting order:', error);
            // Handle the error as needed, e.g., show a user-friendly message
            // You can also rethrow the error to propagate it to the component
            return of(null); // Return an observable to keep the stream alive
          })
        )
        .subscribe(() => {
          console.log('Order Deleted');
          this.showPostedOrders();
        });
    }
  }

  toggleSlideOver() {
    this.isSlideOverHidden = !this.isSlideOverHidden;
  }
  activateTab(tabName: string) {
    this.activeTab = tabName;
  }
  submitForm() {
    console.log('Form Data:', this.formData);
  }
  startToPay(paymentInfo: { isInitiate: any; orderId: any }) {
    const { isInitiate, orderId } = paymentInfo;

    // Check if payment initiation is required
    if (isInitiate) {
      // Initiate payment process based on order ID
      this.initiatePayment(orderId);
      this.isSlideOverHidden = isInitiate;
    } else {
      // Display payment card based on the order ID clicked
      this.displayPaymentCard(orderId);
      this.selectedOrderId = orderId; // Set the selected order ID
    }
  }

  initiatePayment(orderId: any) {
    // Simulate an API call to start the payment process
    // For example, using setTimeout to mimic an asynchronous call
    console.log(`Initiating payment for order ID: ${orderId}`);
    setTimeout(() => {
      // Simulate a successful payment initiation
      console.log(`Payment initiated successfully for order ID: ${orderId}`);
      // Additional logic after successful payment initiation
    }, 2000); // Simulating a delay of 2 seconds (2000 milliseconds)
  }

  displayPaymentCard(orderId: any) {
    // Simulate displaying the payment card
    // console.log(`Displaying payment card for order ID: ${orderId}`);
    this.isSlideOverHidden = false;
    // Additional logic to render the payment card UI
    // For example, update the UI to show payment details for the orderId
  }

  // getAllOrders(token:string){
  //   this.orderService.getAllOrders(token).subscribe((res)=>{
  //     console.log(res)
  //     this.orders = res
  //   })
  // }

  // submitOrderPayment(){
  // const token = localStorage.getItem('jwwtoken')

  // }
  receivePayVar(orderId: any) {
    this.displayPaymentCard(orderId);
    // console.log("Order Id Received",orderId)
  }

  updateOrder(order: Orders): void {
    // Set the selected order in the shared service
    this.menuService.setSelectedOrder(order);

    // Navigate to the EditOrdersComponent
    this.router.navigate(['/orders/edit-orders']);
  }
  startToPayAdvanceOrder(orderId: number) {
    this.router.navigate(['/orders/advaced_orders_payment', orderId]);
  }

  trackPayments(orderId: number) {
    this.router.navigate(['/orders/trackPayments', orderId]);
  }

  completeOrder(orderId: number, balance: any): void {
    this.getAdvanceOrder(orderId, balance);
  }

  reduceStock(advanceOrderItems: any[], orderId: number, balance: any): void {
    // Fetch all categories at once
    this.menuuService.getCategories().subscribe(
      (categories: any[]) => {
        let allProductsHaveEnoughQuantity = true; // Flag to track all products

        const updateProductObservables = advanceOrderItems.map((item: any) => {
          const { category_id, id, selectedItems } = item;

          // Find the category in the retrieved list
          const category = categories.find((c) => c.id === category_id);

          if (category && allProductsHaveEnoughQuantity) {
            // Find the product in the category
            const product = category.products.find(
              (p: {
                id: any;
                product_quantity: number;
                product_name: string;
              }) => p.id === id
            );

            if (product) {
              const currentQuantity = product.product_quantity;

              // Check if current quantity is enough to deduct
              if (currentQuantity >= selectedItems) {
                const newQuantity = currentQuantity - selectedItems;

                // Update the product quantity and return the observable
                return this.menuuService
                  .updateProduct(id, {
                    product_quantity: newQuantity,
                  })
                  .pipe(
                    catchError((error: any) => {
                      console.error('Error updating product quantity:', error);
                      this.notificationService.error(
                        'Failed To Update Product Quantity'
                      );
                      allProductsHaveEnoughQuantity = false; // Set flag to false
                      return of(null); // Return an observable to keep the array of observables complete
                    })
                  );
              } else {
                console.error(
                  'Not enough quantity to deduct for product:',
                  product
                );
                const productName = product.product_name || 'Unknown Product';
                this.notificationService.error(
                  `Not enough quantity for ${productName}. Available: ${currentQuantity}, Required: ${selectedItems}`
                );
                allProductsHaveEnoughQuantity = false; // Set flag to false
                return of(null); // Return an observable to keep the array of observables complete
              }
            } else {
              console.error('Product not found:', item);
              this.notificationService.error('Product not found');
              allProductsHaveEnoughQuantity = false; // Set flag to false
              return of(null); // Return an observable to keep the array of observables complete
            }
          } else {
            console.error('Category not found:', item);
            // this.notificationService.error('Category not found');
            allProductsHaveEnoughQuantity = false; // Set flag to false
            return of(null); // Return an observable to keep the array of observables complete
          }
        });

        // Combine all observables and execute when all are complete
        forkJoin(updateProductObservables).subscribe(
          () => {
            // Check the flag before completing the order
            if (allProductsHaveEnoughQuantity) {
              this.completeOrderAfterReducingStock(orderId, balance);
            }
          },
          (error: any) => {
            console.error('Error updating product quantity:', error);
            this.notificationService.error('Failed To Update Product Quantity');
          }
        );
      },
      (error: any) => {
        console.error('Error retrieving categories:', error);
        this.notificationService.error(
          'Failed to retrieve category information'
        );
      }
    );
  }

  completeOrderAfterReducingStock(orderId: number, balance: any): void {
    if (parseFloat(balance) >= 0) {
      // Now, proceed to complete the order
      let updatedOrderData: any = {
        is_complete: true,
        shift_id: String(this.currentShiftId),
      };

      this.orderService.updateAdvacedOrder(orderId, updatedOrderData).subscribe(
        (response) => {
          this.notificationService.success('Advanced Order Completed');
          this.showPostedOrders();
        },
        (error) => {
          console.error('Update Order Error:', error);
          this.notificationService.error('Order failed to Make payment');
        }
      );
    } else {
      this.notificationService.error('Order is not fully Paid');
    }
  }

  getAdvanceOrder(orderId: number, balance: any): void {
    console.log('advance order', orderId);
    this.orderService.getAdvancedOrderById(orderId).subscribe((res: any) => {
      this.advanceOrder = res;

      // Check if advanceOrder and items are defined before accessing their properties
      if (this.advanceOrder && this.advanceOrder.items) {
        this.advanceOrderItems = JSON.parse(this.advanceOrder.items);
        console.log('advanced Items', this.advanceOrderItems);

        // Call reduceStock only if advanceOrderItems is defined
        this.reduceStock(this.advanceOrderItems, orderId, balance);
      } else {
        // Handle the case where advanceOrder or items is undefined
        console.error('Advance order or items is undefined');
        // You may want to set some default or handle it appropriately
      }
    });
  }
}
