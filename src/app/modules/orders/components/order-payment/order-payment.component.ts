import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TableService } from 'src/app/modules/admin/services/table.service';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { ReceiptPrintingService } from 'src/app/shared/receipt-printing.service';
import { OrdersService } from '../../services/orders.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { UserInterface } from 'src/app/shared/interfaces/auth.interface';

@Component({
  selector: 'app-order-payment',
  templateUrl: './order-payment.component.html',
  styleUrls: ['./order-payment.component.scss'],
})
export class OrderPaymentComponent implements OnInit {
  @Output() selectPayment: EventEmitter<string> = new EventEmitter();
  @Output() initiatePayment: EventEmitter<any> = new EventEmitter();

  @ViewChild('amountInput') amountInput!: ElementRef;
  // cashChecked: boolean = false;
  // mpesaChecked: boolean = false;
  // bankChecked: boolean = false;

  cashAmount: any = 0;
  mpesaAmount: any = 0;
  bankAmount: any = 0;
  voucherAmount: any = 0;
  compilmentaryAmount: any = 0;
  receivedAmount: any;
  totalAmountPaid: any;
  loading:boolean=true

  activeTab: string = 'input';
  paymentMode: string = 'Cash';
  selectedPaymentMode: string = 'cash'; // Initialize with your default payment mode

  activeButtons: boolean[] = [false, false, false];

  activeButtonIndex: number = -1;
  @Input() orderId: any;
  selectedOrderDetails: any = {};
  // amountInput: any;
  // selectPayment: any;
  confirmationCode: any;
  balance: any;
  mpesaConfirmationCode: any;
  bankConfirmationCode: any;
  VoucherCode: any;
  complimentaryOf: any;
  selectedInputField: string = '';
  currentUser: UserInterface | null = null;
  clicked: boolean = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private printingService: ReceiptPrintingService,
    private router: Router,
    private http: HttpClient,
    private userService: UserService,
    private tableService: TableService,
    private notificationService: HotToastService,
    private orderService: OrdersService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.displayPaymentCard(this.orderId);
    console.log('Order Id', this.orderId);
    console.log('Order received', this.receivedAmount);
    console.log('Order Total', this.selectedOrderDetails.Total);
    this.balance =
      parseFloat(this.selectedOrderDetails.Total) -
      parseFloat(this.receivedAmount);
    console.log('balance', this.balance);

    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log('Current User:', this.currentUser);

      // Proceed to load orders based on the user's role
    });
  }
  togglePaymentComponent(componentToShow: string, index: number) {
    this.selectPayment.emit(componentToShow);
    this.activeButtonIndex = index;
    this.cdRef.detectChanges();
    this.paymentMode = componentToShow;
  }

  addToInput(number: number) {
    const currentValue = this.amountInput.nativeElement.value;
    this.amountInput.nativeElement.value = currentValue + number;
    this.receivedAmount = currentValue + number;
    if (this.selectedPaymentMode === 'cash') {
      this.cashAmount = this.receivedAmount;
      console.log('cash input', this.cashAmount);
    } else if (this.selectedPaymentMode === 'mpesa') {
      this.mpesaAmount = this.receivedAmount;
      console.log('mpesa input', this.mpesaAmount);
    } else if (this.selectedPaymentMode === 'bank') {
      this.bankAmount = this.receivedAmount;
      console.log('bank input', this.bankAmount);
    } else if (this.selectedPaymentMode === 'Voucher') {
      this.voucherAmount = this.receivedAmount;
    } else if (this.selectedPaymentMode === 'Complimentary') {
      this.compilmentaryAmount = this.receivedAmount;
    }
  }
  backspace() {
    // Remove the last character from the input field
    const currentValue = this.amountInput.nativeElement.value;
    this.amountInput.nativeElement.value = currentValue.slice(0, -1);
    this.receivedAmount = currentValue.slice(0, -1);
    if (this.selectedPaymentMode === 'cash') {
      this.cashAmount = currentValue.slice(0, -1);
    } else if (this.selectedPaymentMode === 'mpesa') {
      this.mpesaAmount = currentValue.slice(0, -1);
    } else if (this.selectedPaymentMode === 'bank') {
      this.bankAmount = currentValue.slice(0, -1);
    } else if (this.selectedPaymentMode === 'Voucher') {
      this.voucherAmount = currentValue.slice(0, -1);
    } else if (this.selectedPaymentMode === 'Complimentary') {
      this.compilmentaryAmount = currentValue.slice(0, -1);
    }
  }
  onPaymentModeChange() {
    // If any checkbox is checked, set receivedAmount to 0
    if (
      this.selectedPaymentMode === 'cash' ||
      this.selectedPaymentMode === 'mpesa' ||
      this.selectedPaymentMode === 'bank' ||
      this.selectedPaymentMode === 'Voucher' ||
      this.selectedPaymentMode === 'Complimentary'
    ) {
      this.amountInput.nativeElement.value = '';
    }
  }
  payAll() {
    this.receivedAmount =
      parseFloat(this.selectedOrderDetails.Total) -
      parseFloat(this.selectedOrderDetails.amountPaid);
    if (this.selectedPaymentMode === 'cash') {
      this.cashAmount = this.receivedAmount;
    } else if (this.selectedPaymentMode === 'mpesa') {
      this.mpesaAmount = this.receivedAmount;
    } else if (this.selectedPaymentMode === 'bank') {
      this.bankAmount = this.receivedAmount;
    } else if (this.selectedPaymentMode === 'Voucher') {
      this.voucherAmount = this.receivedAmount;
    } else if (this.selectedPaymentMode === 'Complimentary') {
      this.compilmentaryAmount = this.receivedAmount;
    }
    console.log('Received Amount', this.receivedAmount);
    console.log('cash Amount', this.cashAmount);
  }

  displayPaymentCard(orderId: string) {
    this.orderService.getOrderById(orderId).subscribe(
      (orderDetails) => {
        // console.log('Order details:', orderDetails);
        // Update the UI or pass orderDetails to the payment card component
        // For instance, you might assign orderDetails to a component property
        this.selectedOrderDetails = orderDetails;
        this.orderId = orderDetails.id;
        this.loading=false
        console.log('Selected Order Details', this.selectedOrderDetails);
      },
      (error) => {
        console.error('Error fetching order details:', error);
        // Handle errors here
      }
    );
  }
  submitPayment() {
    // Assuming this.selectedOrderDetails.Total contains the total amount to be paid
    const amountPaid = this.selectedOrderDetails.Total;

    // Assuming orderId is already received via @Input()
    if (this.orderId) {
      // Update the amountPaid for the specific order in the database
      this.orderService.updateAmountPaid(14, 400).subscribe(
        () => {
          console.log(
            'Amount paid updated successfully.',
            this.selectedOrderDetails
          );
          // If needed, update the UI or perform any other actions upon successful update
        },
        (error) => {
          console.error('Error updating amount paid:', error);
          // Handle error scenarios
        }
      );
    }
  }

  updateOrder() {
    if (this.orderId) {
      this.clicked = true;
      const parsedAmountPaid =
        parseFloat(this.selectedOrderDetails.amountPaid) || 0;
      const parsedReceived = parseFloat(this.receivedAmount);
      const added = parsedAmountPaid + parsedReceived;
      console.log('Parsed amount already paid:', parsedAmountPaid);
      const totalPaid =
        parseFloat(this.cashAmount || 0) +
        parseFloat(this.mpesaAmount || 0) +
        parseFloat(this.bankAmount || 0) +
        parseFloat(this.voucherAmount || 0) +
        parseFloat(this.compilmentaryAmount || 0);
      this.totalAmountPaid = totalPaid;
      console.log('all payed amount:', totalPaid);
      const amountPaid = totalPaid + parsedAmountPaid;
      const Mpesa_paid =
        parseFloat(this.mpesaAmount || 0) +
        parseFloat(this.selectedOrderDetails.Mpesa_paid || 0);
      console.log(
        'Mpesa paid amount:',
        parseFloat(this.selectedOrderDetails.Mpesa_paid)
      );
      const Cash_paid =
        parseFloat(this.cashAmount || 0) +
        parseFloat(this.selectedOrderDetails.Cash_paid || 0);
      const Bank_paid =
        parseFloat(this.bankAmount || 0) +
        parseFloat(this.selectedOrderDetails.Bank_paid || 0);
      const Voucher_amount =
        parseFloat(this.voucherAmount) +
        parseFloat(this.selectedOrderDetails.Voucher_amount || 0);
      const Complimentary_amount =
        parseFloat(this.compilmentaryAmount) +
        parseFloat(this.selectedOrderDetails.Complimentary_amount || 0);
      const balance =
        parseFloat(this.selectedOrderDetails.amountPaid) +
        totalPaid -
        parseFloat(this.selectedOrderDetails.Total || 0);

      let updatedOrderData: any = {
        amountPaid: amountPaid,
        paymentMode: this.paymentMode,
        Is_complete: false, // Initially set to false
        Cash_paid: Cash_paid,
        Mpesa_paid: Mpesa_paid,
        Bank_paid: Bank_paid,
        balance: balance,
        Mpesa_confirmation_code: this.mpesaConfirmationCode,
        Bank_confirmation_code: this.bankConfirmationCode,
        voucher_code: this.VoucherCode,
        Complementary_of: this.complimentaryOf,
        Voucher_amount: Voucher_amount,
        Complimentary_amount: Complimentary_amount,
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
          this.printFinalReceipt();
          this.notificationService.success('Payment Complete');
          // this.initiatePay();
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/orders/orders-main']);

          // Fetch all tables to find the table associated with the order
          this.tableService.getTables().subscribe((tables) => {
            const orderTableName = this.selectedOrderDetails.TableName; // Assuming TableName holds the table name

            // Find the table by name
            const foundTable = tables.find(
              (table) => table.name === orderTableName
            );
            if (foundTable) {
              this.tableService.markTableAsFree(9).subscribe(() => {
                console.log('Table marked as free');
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';
                this.router.navigate(['/orders/orders-main']);
              });
            } else {
              console.error('Table associated with the order not found');
              // Handle case where the table associated with the order is not found
            }
          });

          // ... (other code after updating the order)
        },
        (error) => {
          console.error('Update Order Error:', error);
          this.notificationService.error('Order failed to Make payment');
        }
      );
    } else {
      console.error('Order ID is not available for update');
    }
  }

  updateOrderEror() {
    this.notificationService.error('Order failed to Make payment');
  }

  printFinalReceipt() {
    const url = 'http://localhost/C-POS-Printer-API/public/api/finalReceipts';
    // const url = 'http://127.0.0.1:8000/api/finalReceipts';

    const updatedOrderData = {
      amountPaid: this.selectedOrderDetails.amountPaid,
      paymentMode: this.paymentMode,
      Is_complete: true,
    };

    const itemsToSend = this.selectedOrderDetails.Items;
    console.log('order items', itemsToSend);
    const data = {
      table_name: this.selectedOrderDetails.TableName || 'Table 1',
      served_by: this.selectedOrderDetails.Served_by,
      items: itemsToSend,
      total: this.selectedOrderDetails.Total,
      time: new Date().toISOString(),
      organization_name: 'Demo',
      till_number: '1234567890',
      payment_mode: this.paymentMode,
      order_id: this.selectedOrderDetails.id,
      amount_paid: this.totalAmountPaid.toString(),
    };
    console.log('data to be posted to print', data);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(url, data, { headers }).subscribe(
      (response) => {
        console.log('Data posted successfully!', response);
        // Handle success response here
      },
      (error) => {
        console.error('Error posting data:', error);
        // Handle error response here
      }
    );
  }

  creditSalesRouting(orderId: number) {
    this.router.navigate(['/orders/creditSales', orderId]);
  }
  initiatePay() {
    const paymentInfo = {
      isIniate: true,
    };
    this.initiatePayment.emit(paymentInfo);
  }
}
