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
import { Router, ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ShiftService } from 'src/app/modules/admin/services/shift.service';
import { TableService } from 'src/app/modules/admin/services/table.service';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { OrdersService } from 'src/app/modules/orders/services/orders.service';
import { OrganizationInterface } from 'src/app/shared/interfaces/organization.interface';
import { ReceiptPrintingService } from 'src/app/shared/receipt-printing.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-credit-sales-payment',
  templateUrl: './credit-sales-payment.component.html',
  styleUrls: ['./credit-sales-payment.component.scss'],
})
export class CreditSalesPaymentComponent implements OnInit {
  @Input() creditSaleId: number | null = null;

  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() selectPayment: EventEmitter<string> = new EventEmitter();
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
  confirmationCode: any;
  balance: any;
  mpesaConfirmationCode: any;
  bankConfirmationCode: any;
  VoucherCode: any;
  complimentaryOf: any;
  currentShiftId: any;
  loggedinUser: any;
  selectedInputField: string = '';
  advancedOrderId: number | null = null;
  creditSaleIdToBePaid: number | null = null;
  posting: boolean = false;

  activeTab: string = 'input';
  paymentMode: string = 'Cash';
  selectedPaymentMode: string = 'cash'; // Initialize with your default payment mode

  activeButtons: boolean[] = [false, false, false];

  activeButtonIndex: number = -1;
  @Input() orderId: any;
  selectedOrderDetails: any = {};
  apiUrl: string = '';
  savedOrg: OrganizationInterface | null = null;
  // amountInput: any;
  // selectPayment: any;

  constructor(
    private cdRef: ChangeDetectorRef,
    private printingService: ReceiptPrintingService,
    private router: Router,
    private http: HttpClient,
    private tableService: TableService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private shiftService: ShiftService,
    private notificationService: HotToastService,
    private orderService: OrdersService,
    private menuService: MenuService,
    private localStorageService: LocalStorageService
  ) {
    this.fetchOrganizationInfo();
  }
  private fetchOrganizationInfo() {
    const companyInfoString = this.localStorageService.getItem('companyInfo');
    this.savedOrg = companyInfoString ? JSON.parse(companyInfoString) : null;
    // console.log('company Infor', this.savedOrg);

    if (!this.savedOrg || !this.savedOrg.id) {
      // console.error('companyInfo is invalid or does not have an id property');
      return;
    }

    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg.id}`;
    // console.log('api url link', this.apiUrl);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      // Retrieve the order ID from the route parameters
      this.creditSaleIdToBePaid = +params['orderId'];
      // Log the order ID for debugging purposes
    });
    console.log('Order IDdddddddddddd:', this.advancedOrderId);
    this.checkForOpenShift();
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        const servedBy = user.username;
        this.loggedinUser = user.username;
      }
    });

    this.displayPaymentCard(this.creditSaleId || this.creditSaleIdToBePaid);
    console.log('Order Id', this.advancedOrderId);
    console.log('Order received', this.receivedAmount);
    console.log('Order Total', this.selectedOrderDetails.Total);
    this.balance =
      parseFloat(this.selectedOrderDetails.Total) -
      parseFloat(this.receivedAmount);
    console.log('balance', this.balance);
  }
  togglePaymentComponent(componentToShow: string, index: number) {
    this.selectPayment.emit(componentToShow);
    this.activeButtonIndex = index;
    this.cdRef.detectChanges();
    this.paymentMode = componentToShow;
  }

  checkForOpenShift(): void {
    this.shiftService.currentShift$.subscribe((shift: any) => {
      if (shift) {
        this.currentShiftId = shift.id;
        console.log('Current Shift', this.currentShiftId);
      }
    });
  }

  cancelCreditSale(): void {
    // Emit the cancel event to notify the parent component
    this.onCancel.emit();
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

  displayPaymentCard(orderId: any) {
    this.orderService.getCreditSalesOrderById(orderId).subscribe(
      (orderDetails) => {
        // console.log('Order details:', orderDetails);
        // Update the UI or pass orderDetails to the payment card component
        // For instance, you might assign orderDetails to a component property
        this.selectedOrderDetails = orderDetails;
        this.orderId = orderDetails.id;
        console.log(
          'Selected credit sale Order Details',
          this.selectedOrderDetails
        );
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
      this.posting=true;
      const parsedAmountPaid =
        parseFloat(this.selectedOrderDetails.amount_paid) || 0;
      const parsedReceived = parseFloat(this.receivedAmount);
      const added = parsedAmountPaid + parsedReceived;
      console.log('Parsed amount already paid:', parsedAmountPaid);
      const totalPaid =
        parseFloat(this.cashAmount || 0) +
        parseFloat(this.mpesaAmount || 0) +
        parseFloat(this.bankAmount || 0) +
        parseFloat(this.voucherAmount || 0) +
        parseFloat(this.compilmentaryAmount || 0);
      console.log('all payed amount:', totalPaid);
      const amountPaid = totalPaid + parsedAmountPaid;
      const Mpesa_paid =
        parseFloat(this.mpesaAmount || 0) +
        parseFloat(this.selectedOrderDetails.mpesa_paid || 0);
      console.log('Mpesa paid amount:', Mpesa_paid);
      const Cash_paid =
        parseFloat(this.cashAmount || 0) +
        parseFloat(this.selectedOrderDetails.cash_paid || 0);
      console.log('cash paid amount:', Cash_paid);
      const Bank_paid =
        parseFloat(this.bankAmount || 0) +
        parseFloat(this.selectedOrderDetails.bank_paid || 0);
      const Voucher_amount =
        parseFloat(this.voucherAmount || 0) +
        parseFloat(this.selectedOrderDetails.voucher_amount || 0);
      const Complimentary_amount =
        parseFloat(this.compilmentaryAmount || 0) +
        parseFloat(this.selectedOrderDetails.complimentary_amount || 0);
      const balance =
        parseFloat(this.selectedOrderDetails.amount_paid || 0) +
        totalPaid -
        parseFloat(this.selectedOrderDetails.credit_amount || 0);

      let updatedOrderData: any = {
        amount_paid: amountPaid,
        customer_name: this.selectedOrderDetails.customer_name || 'null',
        created_by: this.selectedOrderDetails.created_by || 'null',
        payment_date: this.selectedOrderDetails.payment_date,
        phone_number: this.selectedOrderDetails.phone_number,
        shift_id: this.selectedOrderDetails.shift_id,
      };
      // console.log('amount received', this.receivedAmount || this.cashAmount >0);

      // Check if the balance is 0 or more than zero
      if (balance >= 0) {
        updatedOrderData.fully_paid = 1;
      } else {
        updatedOrderData.fully_paid = 0;
      }
      console.log('dataa to be updated', updatedOrderData);
      this.orderService
        .updateCreditSales(
          this.creditSaleId! || this.creditSaleIdToBePaid!,
          updatedOrderData
        )
        .subscribe(
          (response) => {
            // console.log('Response', response)
            this.submitPayments();
            this.notificationService.success('Payment Complete');
            this.posting=false;

          },
          (error) => {
            console.error('Update Order Error:', error);
            this.notificationService.error('Credit Sale Payment failed');
            this.posting=false;

          }
        );
    } else {
      console.error('Order ID is not available for update');
    }
  }

  submitPayments() {
    const currentDateTime = new Date().toISOString();
    const formattedOrderedDate = currentDateTime
      .toString()
      .slice(0, 19)
      .replace('T', ' ');
    const parsedAmountPaid =
      parseFloat(this.selectedOrderDetails.amount_paid) || 0;
    const parsedReceived = parseFloat(this.receivedAmount);
    const added = parsedAmountPaid + parsedReceived;
    console.log('Parsed amount already paid:', parsedAmountPaid);
    const totalPaid =
      parseFloat(this.cashAmount || 0) +
      parseFloat(this.mpesaAmount || 0) +
      parseFloat(this.bankAmount || 0) +
      parseFloat(this.voucherAmount || 0) +
      parseFloat(this.compilmentaryAmount || 0);
    console.log('all payed amount:', totalPaid);
    const amountPaid = totalPaid + parsedAmountPaid;
    const Mpesa_paid = parseFloat(this.mpesaAmount || 0);
    console.log('Mpesa paid amount:', Mpesa_paid);
    const Cash_paid = parseFloat(this.cashAmount || 0);
    console.log('cash paid amount:', Cash_paid);
    const Bank_paid = parseFloat(this.bankAmount || 0);
    const Voucher_amount = parseFloat(this.voucherAmount || 0);
    const Complimentary_amount = parseFloat(this.compilmentaryAmount || 0);
    const balance =
      parseFloat(this.selectedOrderDetails.amount_paid || 0) +
      totalPaid -
      parseFloat(this.selectedOrderDetails.Total || 0);

    // Get form data
    const paymentData = {
      payment_date: formattedOrderedDate,
      credit_sale_id: this.creditSaleId || this.creditSaleIdToBePaid,
      amount_paid: totalPaid,
      cash_paid: Cash_paid,
      mpesa_paid: Mpesa_paid,
      bank_paid: Bank_paid,
      mpesa_confirmation_code: this.mpesaConfirmationCode,
      bank_confirmation_code: this.bankConfirmationCode,
      complimentary_amount: Complimentary_amount,
      complementary_of: this.complimentaryOf,
      voucher_code: this.VoucherCode,
      voucher_amount: Voucher_amount,
      shift_id: this.currentShiftId,
    };
    console.log('payments data', paymentData);

    // Make an HTTP POST request to your Laravel backend
    this.http
      .post(`${this.apiUrl}/credit-sales-payments`, paymentData)
      .subscribe(
        (response: any) => {
          console.log('Post Request Successful', response);

          if (this.creditSaleIdToBePaid) {
            this.router.navigate(['/admin/Credit_sales_report']);
          } else {
            this.onCancel.emit();
          }
          // Optionally, you can handle the response or redirect the user to another page

          // Send the order ID to the main menu component
        },
        (error) => {
          console.error('Post Request Failed', error);
          // Optionally, you can handle the error or display an error message to the user
        }
      );
  }

  printFinalReceipt() {
    const url = 'http://localhost/C-POS-Printer-API/public/api/receipts';
    const updatedOrderData = {
      amountPaid: this.selectedOrderDetails.Total,
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
    };

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
}
