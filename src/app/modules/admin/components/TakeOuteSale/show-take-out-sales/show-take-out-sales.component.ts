import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { OrganizationService } from 'src/app/shared/services/organization/organization.service';
import { OrganizationInterface } from 'src/app/shared/interfaces/organization.interface';
import { OrdersService } from 'src/app/modules/orders/services/orders.service';
import { HotToastService } from '@ngneat/hot-toast';
import { ShiftService } from '../../../services/shift.service';

@Component({
  selector: 'app-show-take-out-sales',
  templateUrl: './show-take-out-sales.component.html',
  styleUrls: ['./show-take-out-sales.component.scss'],
})
export class ShowTakeOutSalesComponent implements OnInit {
  @Input() creditSaleId: number | null = null;

  @Output() onCancel: EventEmitter<void> = new EventEmitter<void>();
  @Output() selectPayment: EventEmitter<string> = new EventEmitter();
  @ViewChild('amountInput') amountInput!: ElementRef;
  takeOutSales: any[] = [];
  selectedOrderDetails: any = {};
  totalAmounts: number[] = [];
  CurrentOrgName: any;
  currentOrganization: OrganizationInterface | null = null;
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
  activeTab: string = 'input';
  paymentMode: string = 'Cash';
  selectedPaymentMode: string = 'cash';
  orderId: number | null = null;
  selectedShiftId: string = '';
  isOpen: boolean = false;
  loading: boolean = true;
  ispaidOrderClicked: boolean = false;

  constructor(
    private adminservice: AdminService,
    private organizationService: OrganizationService,
    private notificationService: HotToastService,
    private shiftService: ShiftService
  ) {}

  ngOnInit(): void {
    this.organizationService.organization$.subscribe(
      (organization: OrganizationInterface | null) => {
        this.currentOrganization = organization;
        console.log(this.currentOrganization);

        this.CurrentOrgName = this.currentOrganization?.id;
        console.log('current organization name', this.CurrentOrgName);
      }
    );
    this.getAllTakeOutSales();
    this.subscribeToCurrentShift();
  }
  subscribeToCurrentShift() {
    this.shiftService.currentShift$.subscribe((shift) => {
      this.selectedShiftId = shift?.id ?? null; // Update the selectedShiftId when currentShift changes
      console.log('current shift id', this.selectedShiftId);
    });
  }

  getAllTakeOutSales() {
    this.loading = true;
    this.adminservice.getAllTakeOutSalesOpen().subscribe((data: any) => {
      console.log('API Response:', data);

      // Check if data has 'sales' property which is an array
      // Filter sales based on fully_paid property
      const filteredSales = data;

      // Group filtered sales by organization and get total amounts
      const { groupedSales, totalAmounts } =
        this.groupByOrganization(filteredSales);

      this.takeOutSales = groupedSales;
      console.log('take out sales filtered', this.takeOutSales);
      this.totalAmounts = totalAmounts;
      this.ispaidOrderClicked = false;
      this.loading = false;
    });
  }

  private groupByOrganization(sales: any[]): {
    groupedSales: any[];
    totalAmounts: number[];
  } {
    const groupedSales: any[] = [];
    const totalAmounts: number[] = [];

    sales.forEach((sale) => {
      const organizationIndex = groupedSales.findIndex(
        (groupedSale) =>
          groupedSale[0]?.organization_name === sale.organization_name
      );

      const saleTotal = sale.pax * parseFloat(sale.cost);

      if (organizationIndex === -1) {
        groupedSales.push([{ ...sale, total: saleTotal }]);
        totalAmounts.push(saleTotal);
      } else {
        groupedSales[organizationIndex].push({ ...sale, total: saleTotal });
        totalAmounts[organizationIndex] += saleTotal;
      }
    });

    return { groupedSales, totalAmounts };
  }
  getAllPaidTakeOutSales() {
    this.adminservice.getAllTakeOutSales().subscribe((data: any) => {
      console.log('API Response:', data);

      // Check if data has 'sales' property which is an array
      if (data && Array.isArray(data.sales)) {
        // Filter sales based on fully_paid property
        const filteredSales = data.sales.filter(
          (sale: { fully_paid: number | null }) => sale.fully_paid == 1
        );

        // Group filtered sales by organization and get total amounts
        const { groupedSales, totalAmounts } =
          this.groupByOrganization(filteredSales);

        this.takeOutSales = groupedSales;
        console.log('take out sales filtered', this.takeOutSales);
        this.totalAmounts = totalAmounts;
        this.ispaidOrderClicked = true;
      } else {
        console.error(
          "Invalid data structure. Expected an array under 'sales' property."
        );
      }
    });
  }

  printOrganizationInvoice(organization: any) {
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      const orgName =
        organization[0]?.organization_name || 'Unknown Organization';
      const grandTotal = organization.reduce(
        (total: number, sale: any) => total + parseFloat(sale.total),
        0
      );

      printWindow.document.write(`
        <html>
        <head>
          <title>Organization Invoice - ${
            this.currentOrganization?.name
          }</title>
          <!-- Add any additional styles or meta tags as needed -->
          <style>
            body {
              font-family: 'Arial', sans-serif;
            }
            .invoice-header {
              background-color: #3498db;
              color: #fff;
              padding: 10px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .org-info {
              margin-bottom: 20px;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
            }
            .title {
              margin: 0;
              font-size: 24px;
            }
            .date {
              margin: 0;
              display: flex;
              flex-direction: column;
            }
            .org-info p {
              margin: 0;
              display: flex;
              justify-content: space-between;
            }
            .invoice-details {
              margin: 20px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <div class="org-info">
            <p>${this.currentOrganization?.name}</p>
            <p>Email: ${this.currentOrganization?.email || 'N/A'}</p>
            <p>Phone Number: ${this.currentOrganization?.phone || 'N/A'}</p>
            <!-- Add more information as needed -->
          </div>
          <div class="invoice-header">
            <p>Bill To: ${orgName}</p>
            <h2 class="title">Invoice</h2>
            <div class="date">
              <p>${new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div class="invoice-details">
          <table>
            <thead>
              <tr>
                <th>Award</th>
                <th>Date</th>
                <th>Pax</th>
                <th>Cost Per Pax</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${organization
                .map(
                  (sale: {
                    award: any;
                    date: any;
                    pax: any;
                    cost: any;
                    items: { name: any; selectedItems: any }[];
                    total: any;
                  }) => `
                <tr>
                  <td>${sale.award}</td>
                  <td>${sale.date}</td>
                  <td>${sale.pax}</td>
                  <td>${sale.cost}</td>
                  <td>
                    ${sale.items
                      .map(
                        (item: { name: any; selectedItems: any }) =>
                          `${item.name} - ${item.selectedItems}`
                      )
                      .join('<br>')}
                  </td>
                  <td>${sale.total}</td>
                </tr>
              `
                )
                .join('')}
              <!-- Add a row for the grand total -->
              <tr class="grand-total">
                <td colspan="5">Grand Total</td>
                <td>${grandTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
          <!-- Add additional sections or details as needed -->
        </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('Failed to open print window.');
    }
  }

  printInvoice(sale: any) {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const orgName = this.currentOrganization?.name || 'Unknown Organization'; // Get the organization name

      printWindow.document.write(`
        <html>
        <head>
          <title>Invoice - ${this.currentOrganization?.name}</title>
          <!-- Add any additional styles or meta tags as needed -->
          <style>
            body {
              font-family: 'Arial', sans-serif;
            }
            .invoice-header {
              background-color: #3498db;
              color: #fff;
              padding: 10px;
              display: flex;
              flex-direction: row;
              justyfy-content: space-between;
              gap: 30px;
            }
            .org-info {
              margin-bottom: 20px;
              display: flex;
              flex-direction: column;
              justify-content: end;
            }
            .titlee {
             items: center;
            }
            .org-info p {
              margin: 0;
              display: flex;
              justify-content: space-between;
            }
            .date {
              margin: 0;
              display: flex;
              flex-direction: column;
             
            }
            .invoice-details {
              margin: 20px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <div class="org-info">
            <p>${this.currentOrganization?.name || 'N/A'}</p>
            <p>Email: ${this.currentOrganization?.email || 'N/A'}</p>
            <p>Phone Number: ${this.currentOrganization?.phone || 'N/A'}</p>
            <!-- Add more information as needed -->
          </div>
          <div class="invoice-header">
          <p>Bill To: ${sale.organization_name || 'N/A'}</p>
            <h2 class="titlee" >Invoice</h2>
            <div class="date">
              <p>${sale.date}</p>
              <p>Invoice#: ${sale.id}</p>
            </div>
          </div>
          <div class="invoice-details">
            <table>
              <thead>
                <tr>
                  <th>Award</th>
                  <th>Date</th>
                  <th>Pax</th>
                  <th>Cost Per Pax</th>
                  <th>Items</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${sale.award}</td>
                  <td>${sale.date}</td>
                  <td>${sale.pax}</td>
                  <td>${sale.cost}</td>
                  <td>
                    ${sale.items
                      .map(
                        (item: { name: any; selectedItems: any }) =>
                          `${item.name} - ${item.selectedItems}`
                      )
                      .join('<br>')}
                  </td>
                  <td>${sale.total}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Add additional sections or details as needed -->
        </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('Error opening print window');
    }
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
    console.log('order id', orderId);
    console.log('all take out sales', this.takeOutSales);

    // Flatten the array before searching
    const flattenedSales = this.takeOutSales.flat();
    this.selectedOrderDetails = flattenedSales.find((x) => x.id === orderId);
    this.isOpen = true;
    this.orderId = orderId;

    console.log('selected order details', this.selectedOrderDetails);
  }

  updateOrder() {
    if (this.orderId) {
      const parsedAmountPaid =
        parseFloat(this.selectedOrderDetails.amount_paid) || 0;
      const parsedReceived = parseFloat(this.receivedAmount);
      const added = parsedAmountPaid + parsedReceived;
      console.log('Parsed amount already paid:', parsedAmountPaid);
      const totalPaid =
        parseFloat(this.cashAmount || 0) +
        parseFloat(this.mpesaAmount || 0) +
        parseFloat(this.bankAmount || 0);
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
        parseFloat(this.selectedOrderDetails.total || 0);

      let updatedOrderData: any = {
        amount_paid: amountPaid,
        cash_paid: Cash_paid,
        mpesa_paid: Mpesa_paid,
        bank_paid: Bank_paid,
        award: this.selectedOrderDetails.award,
        pax: this.selectedOrderDetails.pax,
        cost: this.selectedOrderDetails.cost,
        organization_name: this.selectedOrderDetails.organization_name,
        items: this.selectedOrderDetails.items,
        shift_id: this.selectedShiftId,
      };
      // console.log('amount received', this.receivedAmount || this.cashAmount >0);

      // Check if the balance is 0 or more than zero
      if (balance >= 0) {
        updatedOrderData.fully_paid = true;
      } else {
        updatedOrderData.fully_paid = false;
      }
      console.log('dataa to be updated', updatedOrderData);
      this.adminservice
        .updateTakeOutSales(this.orderId, updatedOrderData)
        .subscribe(
          (response) => {
            // console.log('Response from paymensts', response)
            // this.submitPayments();
            this.getAllTakeOutSales();
            this.notificationService.success('Payment Complete');
            this.isOpen = false;
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
  deleteTakeOutSale(id: string) {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this sale?'
    );
    if (isConfirmed) {
      this.adminservice.deleteTakeOutSales(id).subscribe(
        (res) => {
          this.notificationService.success('Sale Deleted!!');
          this.getAllTakeOutSales();
        },
        (error: any) => {
          console.log(error);
          this.notificationService.error('Sale failed to Delete!!');
        }
      );
    }
  }
  closeModal() {
    this.isOpen = false;
  }
}
