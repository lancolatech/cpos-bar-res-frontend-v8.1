import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { ShiftService } from 'src/app/modules/admin/services/shift.service';
import { TableService } from 'src/app/modules/admin/services/table.service';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { OrdersService } from 'src/app/modules/orders/services/orders.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { UserService } from 'src/app/shared/services/user/user.service';

@Component({
  selector: 'app-make-credit-sales',
  templateUrl: './make-credit-sales.component.html',
  styleUrls: ['./make-credit-sales.component.scss'],
})
export class MakeCreditSalesComponent implements OnInit {
  orderId: any;
  SelectedOrder: any;
  customers: any;
  selectedCustomerDetails: any;
  paymentDay: any;
  creditAmount: any;
  selectedShiftId: any;
  loggedinUser: any;
  selectedCustomer: number | undefined;
  isOpen: boolean = false;
  loading: boolean = true;
  posting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: HotToastService,
    private tableService: TableService,
    private menuService: MenuService,
    private ordersService: OrdersService,
    private shiftService: ShiftService,
    private http: HttpClient,
    private authService: AuthService,
    private adminService: AdminService // private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      // Retrieve the order ID from the route parameters
      this.orderId = params['orderId'];
      console.log('This this the id of order to be paid ', this.orderId);

      // Log the order ID for debugging purposes
    });
    this.getAllCreditors();
    this.getOrderToBePaid();
    this.getCreditorsById();
    // this.submitCreditSales();
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        const servedBy = user.username;
        this.loggedinUser = user.username;
      }
    });
    this.subscribeToCurrentShift();
  }

  // getAllCreditSalesOtherPage() {
  //   const url = 'https://api.c-pos.co.ke/api/credit-sales';
  //   this.http.get(url).subscribe((orders: any) => {
  //     this.creditSales = orders.filter(
  //       (order: { fully_paid: any; deleted: any }) => !order.fully_paid
  //     );

  //     console.log(
  //       'credit sales to transfer from other page:',
  //       this.creditSales
  //     );
  //   });
  // }

  getAllCreditors() {
    this.adminService.getAllCustomers().subscribe((customers) => {
      this.customers = customers;
      console.log('all customers', this.customers);
    });
  }
  getCreditorsById() {
    if (this.selectedCustomer !== null) {
      const customerId = this.selectedCustomer;
      this.adminService.getCustomerById(customerId).subscribe((customers) => {
        this.selectedCustomerDetails = customers;
        console.log('Selected customer', this.selectedCustomerDetails);
      });
    }
  }
  getOrderToBePaid() {
    this.menuService.getOrderDetailsById(this.orderId).subscribe((order) => {
      this.SelectedOrder = order;
      this.loading = false;
      console.log(this.SelectedOrder);
    });
  }
  subscribeToCurrentShift() {
    this.shiftService.currentShift$.subscribe((shift) => {
      this.selectedShiftId = shift?.id ?? null; // Update the selectedShiftId when currentShift changes
    });
  }
  submitCreditSale(): void {
    if (this.selectedCustomer) {
      // const formattedOrderDate = this.datePipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss.SSSZ');
      this.posting = true;

      const currentDateTime = new Date().toISOString();
      const formattedOrderedDate = currentDateTime
        .toString()
        .slice(0, 19)
        .replace('T', ' ');
      this.creditAmount =
        parseFloat(this.SelectedOrder.Total || 0) -
        parseFloat(this.SelectedOrder.amountPaid || 0);

      const creditSaleDetails = {
        order_id: this.SelectedOrder.id,
        customer_id: this.selectedCustomer,
        phone_number: this.selectedCustomerDetails.phoneNumber || 'null',
        customer_name: this.selectedCustomerDetails.fullName || 'null',
        created_by: this.loggedinUser,
        shift_id: this.SelectedOrder.ShiftID,
        credit_amount: this.creditAmount,
        fully_paid: 0,
        // order_id: this.orderId,
        amount_paid: 0,
        payment_date: this.paymentDay,
        order_date: formattedOrderedDate,
        // order_date: formattedOrderDate,
        // Add other properties as needed
      };
      console.log('Credit sale to be created :', creditSaleDetails);

      // Call the OrderService to create the credit sale
      this.ordersService.createCreditSale(creditSaleDetails).subscribe(
        (response) => {
          // Handle success
          //  this.toast.success('Credit sale created successfully');
          this.updateOrder();
          this.posting = false;
        },
        (error) => {
          // Handle error
          this.toast.error(
            'Error creating credit sale please check Your internet'
          );
          this.posting = false;
        }
      );
    } else {
      console.error('Please select a customer before submitting.');
    }
  }
  // submitCreditSales(): void {
  //   const connfirmWinfdow = window.confirm(
  //     'Are you sure you want to submit the credit sales?'
  //   );
  //   if (connfirmWinfdow) {
  //     this.creditSales.forEach((sale) => {
  //       const creditSaleDetails = {
  //         order_id: sale.order_id,
  //         customer_id: String(sale.customer_id),
  //         phone_number: sale.phone_number,
  //         customer_name: sale.customer_name,
  //         created_by: sale.created_by,
  //         shift_id: String(sale.shift_id),
  //         credit_amount: sale.credit_amount,
  //         fully_paid: sale.fully_paid,
  //         amount_paid: sale.amount_paid,
  //         payment_date: sale.payment_date,
  //         order_date: sale.order_date,
  //       };

  //       this.posting = true;

  //       this.ordersService.createCreditSale(creditSaleDetails).subscribe(
  //         (response) => {
  //           console.log('Credit sale created successfully', response);
  //           this.posting = false;
  //           this.toast.success('Credit sale created successfully');
  //         },
  //         (error) => {
  //           console.error('Error creating credit sale:', error);
  //           this.toast.error(
  //             'Error creating credit sale, please check your internet'
  //           );
  //           this.posting = false;
  //         }
  //       );
  //     });
  //   }
  // }

  onCustomerSelectionChange() {
    console.log('Selected Customer ID:', this.selectedCustomer);
    if (this.selectedCustomer !== null) {
      const customerId = this.selectedCustomer;
      this.adminService.getCustomerById(customerId).subscribe((customers) => {
        this.selectedCustomerDetails = customers;
        console.log('Selected customer', this.selectedCustomerDetails);
      });
    }
  }

  updateOrder() {
    if (this.orderId) {
      let updatedOrderData: any = {
        Is_complete: 1,
      };
      // console.log('amount received', this.receivedAmount || this.cashAmount >0);

      // Check if the balance is 0 or more than zero
      if (updatedOrderData.balance >= 0) {
        updatedOrderData.Is_complete = true;
      }
      console.log('dataa to be updated', updatedOrderData);
      this.menuService.updateOrder(this.orderId, updatedOrderData).subscribe(
        (response) => {
          // console.log('Response', response)
          this.toast.success('Credit sales Made Successfully');

          this.router.navigate(['/orders']);
        },
        (error) => {
          console.error('Update Order Error:', error);
          this.toast.error('Order failed to Make payment');
        }
      );
    } else {
      console.error('Order ID is not available for update');
    }
  }

  openModal(): void {
    this.isOpen = true;
  }

  closeModal(): void {
    this.isOpen = false;
    this.getAllCreditors();
  }
}
