import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { Orders } from 'src/app/modules/menu/interfaces/Orders';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ShiftService } from 'src/app/modules/admin/services/shift.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import {
  UserInterface,
  UserRolesEnum,
} from 'src/app/shared/interfaces/auth.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HotToastService } from '@ngneat/hot-toast';
import { AdminService } from 'src/app/modules/admin/services/admin.service';

@Component({
  selector: 'app-orders-main',
  templateUrl: './orders-main.component.html',
  styleUrls: ['./orders-main.component.scss'],
})
export class OrdersMainComponent implements OnInit {
  activeTab = 'tab1';
  isSlideOverHidden = true;
  isPaymentInput: string = 'input';
  selectedOrderId: any;
  // orders:any[]=[]
  formData: any = {
    field: '7',
  };
  // constructor(private orderService: OrdersService){

  // }
  orders: Orders[] = [];
  closedOrders: Orders[] = [];
  orgOptions: any;

  items: [] = [];
  currentUser: UserInterface | null = null;
  selectedOrderDetails: any;
  orderId: any;
  loading: boolean = true;

  constructor(
    private menuService: MenuService,
    private userService: UserService,
    private shiftService: ShiftService,
    private router: Router,
    private sharedService: OrdersService,
    private toast: HotToastService,
    private authService: AuthService,
    private adminService: AdminService
  ) {}
  ngOnInit(): void {
    // Fetching the current user
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log('Current User:', this.currentUser);

      // Proceed to load orders based on the user's role
      this.getOrgOptions();
    });
  }
  getOrgOptions() {
    this.adminService.orgOptions$.subscribe((orgOptions) => {
      this.orgOptions = orgOptions;
      console.log('org options', this.orgOptions);
      if (this.orgOptions.has_shifts === false) {
        this.getIncompleteOrdersForClosedShifts();
      } else {
        this.showPostedOrders();
      }
    });
  }

  getIncompleteOrdersForClosedShifts() {
    this.menuService
      .getIncompletePostedOrdersForClosedShifts()
      .subscribe((data: any[]) => {
        this.closedOrders = data;
        this.showPostedOrders();

        console.log('All incomplete Orders', this.orders);
      });
  }

  showPostedOrders(): void {
    this.shiftService.currentShift$.subscribe((currentShift) => {
      if (currentShift && this.currentUser) {
        const id = currentShift.id;
        if (
          this.currentUser.role === 'Admin' ||
          this.currentUser.role === 'SALES'
        ) {
          this.menuService
            .getIncompletePostedOrdersForShift(id)
            .subscribe((data: any[]) => {
              if (this.closedOrders.length > 0) {
                this.orders = this.closedOrders;
                this.toast.warning(
                  'Orders found for Previous Days,Please Close them First To See today Orders'
                );
              } else {
                this.orders = data;
                console.log('All admin Orders', this.orders);
              }
              this.loading = false;

              // this.sortOrdersById();
            });
        } else if (this.currentUser.role === 'WAITER') {
          this.menuService
            .getIncompletePostedOrdersForShift(id)
            .subscribe((data: any[]) => {
              if (this.closedOrders.length > 0) {
                this.orders = this.closedOrders;
                this.toast.warning(
                  'Orders found for Previous Days,Please Close them First To See today Orders'
                );
              } else {
                this.orders = data.filter(
                  (order: any) => order.Served_by === this.currentUser!.username
                );
              }
              this.loading = false;

              // this.sortOrdersById();
            });
        }
      }
    });
  }

  // sortOrdersById(): void {
  //   this.orders = this.orders.sort((a, b) => {
  //     const idA = a.id;
  //     const idB = b.id;
  //     return idB - idA;
  //   });

  //   for (const order of this.orders) {
  //     order.OrderItems = JSON.parse(order.Items);
  //   }
  //   console.log('Filtered and sorted orders:', this.orders);
  // }

  deleteOrder(orderId: string): void {
    if (confirm('Are you sure you want to delete this order?')) {
      this.menuService
        .deleteOrder(orderId)
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
          this.logoutUser();
        });
    }
  }
  logoutUser(): void {
    this.authService.logout();
  }

  orderToBePrinted(orderId: any) {
    this.sharedService.rePrintOrder(orderId).subscribe(
      (orderDetails) => {
        console.log('order reprinted');
      },
      (error) => {
        this.toast.error('Error Printing');
      }
    );
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
  startToPay(paymentInfo: { isInitiate: any; orderId?: any }) {
    const { isInitiate, orderId } = paymentInfo;
    this.showPostedOrders();

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
    this.sharedService.setSelectedOrder(order);

    // Navigate to the EditOrdersComponent
    this.router.navigate(['/orders/edit-orders']);
  }
}
