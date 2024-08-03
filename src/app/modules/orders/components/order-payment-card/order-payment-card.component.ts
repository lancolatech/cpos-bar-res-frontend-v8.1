import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Router } from '@angular/router';
import { ReceiptPrintingService } from 'src/app/shared/receipt-printing.service';
import * as printJS from 'print-js';
import { TableService } from 'src/app/modules/admin/services/table.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HotToastService } from '@ngneat/hot-toast';



@Component({
  selector: 'app-order-payment-card',
  templateUrl: './order-payment-card.component.html',
  styleUrls: ['./order-payment-card.component.scss']
})
export class OrderPaymentCardComponent implements OnInit {
  @Output() selectPayment: EventEmitter<string> = new EventEmitter();
  @ViewChild('amountInput') amountInput!: ElementRef;
  receivedAmount:any;

  

  activeTab: string = 'input';
  paymentMode:string='Cash'
 
activeButtons: boolean[] = [false, false, false];

activeButtonIndex: number = -1;
@Input() orderId: any;
selectedOrderDetails:any={}

constructor(private cdRef: ChangeDetectorRef,
  private printingService:ReceiptPrintingService,private router: Router, 
  private http:HttpClient,
  private tableService: TableService,
  private notificationService:HotToastService,private orderService:OrdersService,private menuService:MenuService) { }

ngOnInit(): void {
  this.displayPaymentCard(this.orderId)
}
togglePaymentComponent(componentToShow: string, index: number) {
  this.selectPayment.emit(componentToShow);
  this.activeButtonIndex = index;
  this.cdRef.detectChanges();
  this.paymentMode=componentToShow
}

addToInput(number: number) {
  const currentValue = this.amountInput.nativeElement.value;
  this.amountInput.nativeElement.value = currentValue + number;
  this.receivedAmount=currentValue + number;
}
backspace() {
  // Remove the last character from the input field
  const currentValue = this.amountInput.nativeElement.value;
  this.amountInput.nativeElement.value = currentValue.slice(0, -1);
  this.receivedAmount=currentValue.slice(0, -1);
}

displayPaymentCard(orderId: any) {
  this.orderService.getOrderById(orderId).subscribe(
    (orderDetails) => {
      // console.log('Order details:', orderDetails);
      // Update the UI or pass orderDetails to the payment card component
      // For instance, you might assign orderDetails to a component property
      this.selectedOrderDetails = orderDetails;
      this.orderId=orderDetails.id
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
    this.orderService.updateAmountPaid(14, 400)
      .subscribe(
        () => {
          console.log('Amount paid updated successfully.', this.selectedOrderDetails);
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
    const parsedAmountPaid = parseFloat(this.selectedOrderDetails.amountPaid);
    const parsedReceived = parseFloat(this.receivedAmount);
    const added = parsedAmountPaid + parsedReceived;
    console.log('Parsed added Paid:', added);

    let updatedOrderData: any = {
      amountPaid: added,
      paymentMode: this.paymentMode,
      Is_complete: false, // Initially set to false
      Cash_paid:this.selectedOrderDetails.Cash_paid,
      Mpesa_paid:this.selectedOrderDetails.Mpesa_paid,
      Bank_paid:this.selectedOrderDetails.Bank_paid
    };
    console.log('amount received', this.receivedAmount);

    // Conditionally update fields based on payment mode
    switch (this.paymentMode) {
      case 'Cash':
        const remainingCashAmount = this.selectedOrderDetails.amountPaid - this.selectedOrderDetails.Total + parsedReceived;
        updatedOrderData = { ...updatedOrderData, Cash_paid: this.receivedAmount, balance: remainingCashAmount };
        break;
      case 'Mpesa':
        // Assuming selectedOrderDetails.Total contains the total amount to be paid
        const remainingAmount = this.selectedOrderDetails.amountPaid - this.selectedOrderDetails.Total + parsedReceived;
        updatedOrderData = { ...updatedOrderData, Mpesa_paid: this.receivedAmount, balance: remainingAmount };
        break;
      case 'Bank':
        // Assuming selectedOrderDetails.Total contains the total amount to be paid
        const remainingBankAmount = this.selectedOrderDetails.amountPaid - this.selectedOrderDetails.Total + parsedReceived;
        updatedOrderData = { ...updatedOrderData, Bank_paid: this.receivedAmount, balance: remainingBankAmount };
        break;
      default:
        break;
    }

    // Check if the balance is 0 or more than zero
    if (updatedOrderData.balance >= 0) {
      updatedOrderData.Is_complete = true;
    }
    console.log('dataa to be updated', updatedOrderData);
    this.menuService.updateOrder(this.orderId, updatedOrderData).subscribe(
      (response) => {
        this.notificationService.success('Payment Complete');
        this.printFinalReceipt();

        // Fetch all tables to find the table associated with the order
        this.tableService.getTables().subscribe((tables) => {
          const orderTableName = this.selectedOrderDetails.TableName; // Assuming TableName holds the table name

          // Find the table by name
          const foundTable = tables.find((table) => table.name === orderTableName);
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






printFinalReceipt() {
  const url = 'http://localhost/C-POS-Printer-API/public/api/receipts';
  const updatedOrderData = {
    amountPaid: this.selectedOrderDetails.Total,
    paymentMode: this.paymentMode,
    Is_complete: true,
  };
  
  const itemsToSend=this.selectedOrderDetails.Items
  console.log('order items',itemsToSend)
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
    'Content-Type': 'application/json'
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
