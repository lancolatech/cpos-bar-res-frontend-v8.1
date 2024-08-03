import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { ShiftService } from '../../../services/shift.service';
import { OrdersService } from 'src/app/modules/orders/services/orders.service';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-income-reports',
  templateUrl: './income-reports.component.html',
  styleUrls: ['./income-reports.component.scss'],
})
export class IncomeReportsComponent implements OnInit {
  orders: any[] = [];
  pettyCash: any[] = [];
  PettyPaidWithCash: any[] = [];
  PettyPaidWithMpesa: any[] = [];
  advancedOrders: any[] = [];
  advancedOrdersPayments: any[] = [];
  creditSalesPayments: any[] = [];
  shifts: any[] = []; // Array to hold all shifts
  selectedShiftId: string = ''; // Track the selected shift ID
  currentShift: any; // Update the type based on your Shift interface or model

  cashAmount: number = 0;
  bankAmount: number = 0;
  mpesaAmount: number = 0;
  advanceCashAmount: number = 0;
  advanceBankAmount: number = 0;
  advanceMpesaAmount: number = 0;
  totalIncome: number = 0;
  totalIncomee: number = 0;
  complimentedOrders: number = 0;
  paidWithVoucher: number = 0;
  advanceComplimentedOrders: number = 0;
  advancePaidWithVoucher: number = 0;
  creditSalesPaidWithMpesa: number = 0;
  creditSalesPaidWithCash: number = 0;
  creditSalesPaidWithBank: number = 0;
  creditSalesPaidWithVoucher: number = 0;
  creditSalesPaidWithBankComplimentary: number = 0;
  TotalCreditSalesPayed: number = 0;
  totalPetyCashAmount: number = 0;
  totalPetyCashAmountCash: number = 0;
  totalPetyCashAmountMpesa: number = 0;
  startDate: Date | null = null;
  endDate: Date | null = null;
  loading: boolean = true;
  shiftRepots: boolean = true;
  selectedRangeReports: any;
  selectedShiftReports: any;
  selectedShiftCreditSalesReports: any;
  selectedShiftAdvanceOrderSalesReports: any;
  selectedShiftPettyCashReports: any;

  constructor(
    private shiftService: ShiftService,
    private menuService: MenuService,
    private orderServive: OrdersService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    // this.shiftService.currentShift$.subscribe((shift) => {
    //   this.currentShift = shift;
    //   if (this.currentShift) {
    //     this.fetchOrdersForCurrentShift();
    //   }
    // });

    this.loadAllShifts();
    this.subscribeToCurrentShift();
    // this.fetchOrdersForSelectedShift();
    // this.fetchAdvancedOrdersPaymentsForSelectedShift();
    // this.fetchCreditSalesPaymentsForSelectedShift();
  }

  loadAllShifts() {
    this.shiftService.getAllShifts().subscribe((data: any[]) => {
      // Sort shifts by TimeStarted in descending order
      this.shifts = data.sort(
        (a, b) =>
          new Date(b.TimeStarted).getTime() - new Date(a.TimeStarted).getTime()
      );
      this.loading = false;
      console.log('All shifts', this.shifts);
    });
  }

  subscribeToCurrentShift() {
    this.shiftService.currentShift$.subscribe((shift) => {
      this.selectedShiftId = shift?.id ?? null; // Update the selectedShiftId when currentShift changes
      if (this.selectedShiftId !== null) {
        this.fetchOrdersForSelectedShift();
        this.fetchPettyCashForSelectedShift();
        this.fetchAdvanceOrdersForSelectedShift();
        this.fetchCreditSalesForSelectedShift();
      }
    });
  }

  fetchAdvancedOrdersPaymentsForSelectedShift() {
    if (this.selectedShiftId !== null) {
      this.orderServive.getAdvanceOrdersPayments().subscribe((data: any[]) => {
        // console.log("All orders payments advanced from service:", data);
        this.advancedOrdersPayments = data.filter(
          (order) => order.shift_id === +this.selectedShiftId! && !order.deleted
        );
        // console.log("Orders advanced payments for the selected shift:", this.advancedOrders);

        // this.calculateAdvancedIncomeForShift();
      });
    }
  }
  fetchCreditSalesPaymentsForSelectedShift() {
    if (this.selectedShiftId !== null) {
      this.orderServive.getAllCreditSalesPayments().subscribe((data: any[]) => {
        // console.log("All orders payments advanced from service:", data);
        this.creditSalesPayments = data.filter(
          (order) => order.shift_id === +this.selectedShiftId!
        );
        // console.log("Orders credit sales  payments for the selected shift:", this.creditSalesPayments);

        this.calculateCreditSalesIcomeForShift();
      });
    }
  }

  fetchPettyCashForSelectedShift() {
    if (this.selectedShiftId !== null) {
      this.menuService
        .getPettyCashForAShift(this.selectedShiftId)
        .subscribe((data: any) => {
          this.selectedShiftPettyCashReports = data;
          this.pettyCash = data.totalPettyCash;
          this.PettyPaidWithMpesa = data.totalMpesaPaid;
          this.PettyPaidWithCash = data.totalCashPaid;
          console.log('Data petty cash for selected shift:', data);
        });
    }
  }

  fetchOrdersForSelectedShift() {
    if (this.selectedShiftId !== null) {
      this.menuService
        .getPostedOrdersForAShift(this.selectedShiftId)
        .subscribe((data: any) => {
          this.shiftRepots = true;
          this.orders = data.orders;
          this.selectedShiftReports = data;
          console.log('Data reports for selected shift:', data);

          this.loading = false;
        });
    }
  }
  fetchCreditSalesForSelectedShift() {
    if (this.selectedShiftId !== null) {
      this.menuService
        .getCreditSalesPaymentsForAShift(this.selectedShiftId)
        .subscribe((data: any) => {
          this.selectedShiftCreditSalesReports = data;
          this.creditSalesPaidWithBank = data.creditPaymentModes.bank;
          this.creditSalesPaidWithCash = data.creditPaymentModes.cash;
          this.creditSalesPaidWithMpesa = data.creditPaymentModes.mpesa;
          this.creditSalesPaidWithBankComplimentary =
            data.creditPaymentModes.complements;
          this.creditSalesPaidWithVoucher = data.creditPaymentModes.vouchers;
          this.TotalCreditSalesPayed = data.creditPaymentModes.totalIncome;
          console.log(
            'Data credit sales for selected shift using mpesa :',
            this.creditSalesPaidWithMpesa
          );
          console.log('Data for selected shift:', data);
          // this.usersSales = data.userSales;
          // console.log('waiters sales', this.usersSales);
        });
    }
  }
  fetchAdvanceOrdersForSelectedShift() {
    if (this.selectedShiftId !== null) {
      this.menuService
        .getAdvanceOrdersForAShift(this.selectedShiftId)
        .subscribe((data: any) => {
          this.advancedOrders = data.orders;
          this.selectedShiftAdvanceOrderSalesReports = data;
          console.log('Data advance for selected shift:', data);
          // this.usersSales = data.userSales;
          // console.log('waiters sales', this.usersSales);
        });
    }
  }

  fetchOrdersForSelectedTimeRange() {
    if (this.startDate && this.endDate) {
      this.selectedShiftId = '';
      // this.selectedShiftReports = null;
      this.clearData();

      // Convert the observable to a promise
      const postedOrdersPromise = this.menuService
        .getPostedOrdersForSelectedTimeRange(this.startDate!, this.endDate!)
        .toPromise();

      // Use Promise.all to wait for the data
      Promise.all([postedOrdersPromise])
        .then(([data]) => {
          this.selectedRangeReports = data;
          console.log(
            'selected range sales reports',
            this.selectedRangeReports
          );

          // Calculate total sales on each shift
          this.selectedRangeReports.forEach((shiftReport: any) => {
            const totalSalesOnShift = shiftReport.totalSales;
            console.log(
              `Total sales on shift ${shiftReport.shiftName}: ${totalSalesOnShift}`
            );
          });

          // Calculate total sales for all shifts
          const allShiftTotalSales = this.selectedRangeReports.reduce(
            (total: number, shiftReport: any) => total + shiftReport.totalSales,
            0
          );
          this.shiftRepots = false;
          this.loading = false;
          // this.totalSales = allShiftTotalSales;
          // console.log('Total sales for all shifts:', this.totalSales);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          this.loading = false;
          // Handle error scenario
        });
    }
  }

  clearData() {
    this.orders = [];
    this.advancedOrders = [];

    this.loading = true;

    // this.selectedShiftId = '';
  }
  onDateChange(type: 'start' | 'end', selectedDate: Date | null) {
    console.log(`${type} date selected:`, selectedDate);
    if (selectedDate) {
      // Parse the selected date string into a Date object
      const date = new Date(selectedDate);

      // Strip the time part from the selected date
      date.setHours(0, 0, 0, 0);

      // if (type === 'start') {
      //   this.startDate = date;
      // } else if (type === 'end') {
      //   this.endDate = date;
      // }

      this.fetchOrdersForSelectedTimeRange();
    }
  }

  searchOrdersByDateTimeRange() {
    if (this.selectedShiftId !== null) {
      if (this.startDate && this.endDate) {
        // Adjust startDate to the beginning of the day (00:00:00)
        const adjustedStartDate = new Date(this.startDate);
        adjustedStartDate.setHours(0, 0, 0, 0);

        // Adjust endDate to the end of the day (23:59:59)
        const adjustedEndDate = new Date(this.endDate);
        adjustedEndDate.setHours(23, 59, 59, 999);

        this.orderServive.getAdvanceOrders().subscribe((data: any[]) => {
          this.advancedOrders = data.filter(
            (order) =>
              !order.deleted &&
              this.isOrderInDateTimeRange(
                order,
                adjustedStartDate,
                adjustedEndDate
              )
          );
          this.calculateAdvancedIncomeForShift();
        });

        this.orderServive.getAllCreditSales().subscribe((data: any[]) => {
          this.creditSalesPayments = data.filter(
            (order) =>
              !order.deleted &&
              this.isOrderInDateTimeRange(
                order,
                adjustedStartDate,
                adjustedEndDate
              )
          );
          this.calculateCreditSalesIcomeForShift();
        });
        this.adminService.getAllPettyCash().subscribe((data: any[]) => {
          this.pettyCash = data.filter(
            (order) =>
              !order.deleted &&
              this.isOrderInDateTimeRange(
                order,
                adjustedStartDate,
                adjustedEndDate
              )
          );
          this.PettyPaidWithCash = this.pettyCash.filter(
            (petty) => petty.paymentMode === 'Cash'
          );
          this.PettyPaidWithMpesa = this.pettyCash.filter(
            (petty) => petty.paymentMode === 'Mpesa'
          );
          console.log(
            'Petty Cash for the selected shift:',
            this.PettyPaidWithCash
          );
          this.calculateShiftTotalPetyCash();
        });

        // Filter orders based on shift, date, and time range
        this.menuService.getPostedOrders().subscribe((data: any[]) => {
          this.orders = data.filter(
            (order) =>
              !order.deleted &&
              this.isOrderInDateTimeRange(
                order,
                adjustedStartDate,
                adjustedEndDate
              )
          );

          // Log orders within the specified date and time range
          console.log(
            'Orders within the specified date and time range:',
            this.orders
          );

          // Update the report calculations based on the filtered orders
          this.calculateIncomeForShift();
        });
      } else {
        // Fetch orders for the current or selected shift when no date range is provided
        this.fetchOrdersForSelectedShift();
      }
    }
  }

  isOrderInDateTimeRange(
    order: any,
    startDate: Date | null,
    endDate: Date | null
  ): boolean {
    const orderDateTime = new Date(order.Time);

    if (startDate instanceof Date) {
      if (orderDateTime < startDate) {
        return false;
      }
    }

    if (endDate instanceof Date) {
      // Adjust the endDate to include the full day
      const adjustedEndDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
      if (orderDateTime >= adjustedEndDate) {
        return false;
      }
    }

    return true;
  }

  calculateShiftTotalPetyCash() {
    // Calculate total sales for the current shift
    this.totalPetyCashAmount = this.pettyCash.reduce((total, petty) => {
      return total + parseFloat(petty.amount);
    }, 0);
    this.totalPetyCashAmountCash = this.pettyCash.reduce((total, petty) => {
      return total + parseFloat(petty.amount);
    }, 0);
    this.totalPetyCashAmountMpesa = this.pettyCash.reduce((total, petty) => {
      return total + parseFloat(petty.amount);
    }, 0);
    console.log('Total Petty Cash Amount:', this.totalPetyCashAmountCash);
  }

  onShiftSelectionChange() {
    this.loading = true;
    console.log('currentShift', this.selectedShiftId);
    // Fetch orders for the newly selected shift
    // this.fetchOrdersForSelectedShift();
    // this.fetchPettyCashForSelectedShift();
    // this.fetchAdvancedOrdersForSelectedShift();
    // this.fetchAdvancedOrdersPaymentsForSelectedShift();
    // this.calculateCreditSalesIcomeForShift();
    // this.fetchCreditSalesPaymentsForSelectedShift();

    this.fetchOrdersForSelectedShift();
    this.fetchPettyCashForSelectedShift();
    this.fetchAdvanceOrdersForSelectedShift();
    this.fetchCreditSalesForSelectedShift();
  }

  //   fetchOrdersForCurrentShift() {
  //     const id = this.currentShift.id;
  // console.log("current shift",id)
  //     this.menuService.getPostedOrders().subscribe((data: any[]) => {
  //       this.orders = data.filter((order) => order.ShiftID === id);
  //       this.calculateIncomeForShift();
  //     });
  //   }

  calculateIncomeForShift() {
    this.cashAmount = this.orders.reduce((total, order) => {
      const cashPaid = parseFloat(order.Cash_paid || '0');
      return isNaN(cashPaid) ? total : total + cashPaid;
    }, 0);

    this.mpesaAmount = this.orders.reduce((total, order) => {
      const mpesaPaid = parseFloat(order.Mpesa_paid || '0');
      return isNaN(mpesaPaid) ? total : total + mpesaPaid;
    }, 0);

    this.bankAmount = this.orders.reduce((total, order) => {
      const bankPaid = parseFloat(order.Bank_paid || '0');
      return isNaN(bankPaid) ? total : total + bankPaid;
    }, 0);
    this.complimentedOrders = this.orders.reduce((total, order) => {
      const Complimentary_amount = parseFloat(
        order.Complimentary_amount || '0'
      );
      return isNaN(Complimentary_amount) ? total : total + Complimentary_amount;
    }, 0);
    this.paidWithVoucher = this.orders.reduce((total, order) => {
      const Voucher_amount = parseFloat(order.Voucher_amount || '0');
      return isNaN(Voucher_amount) ? total : total + Voucher_amount;
    }, 0);
    this.totalIncome = this.orders.reduce((total, order) => {
      const Voucher_amount = parseFloat(order.amountPaid || '0');
      return isNaN(Voucher_amount) ? total : total + Voucher_amount;
    }, 0);
    // console.log("amountPaid",this.totalIncome)

    // console.log("cash paid", this.cashAmount);
    // console.log("mpesa paid", this.mpesaAmount);
    // console.log("bank paid", this.bankAmount);

    // Calculate the total income by summing up all payment modes
    this.totalIncomee =
      this.cashAmount +
      this.bankAmount +
      this.mpesaAmount +
      this.complimentedOrders +
      this.paidWithVoucher +
      this.advanceBankAmount +
      this.advanceCashAmount +
      this.advanceMpesaAmount +
      this.advanceComplimentedOrders +
      this.advancePaidWithVoucher +
      this.creditSalesPaidWithBank +
      this.creditSalesPaidWithBankComplimentary +
      this.creditSalesPaidWithCash +
      this.creditSalesPaidWithMpesa;
    this.loading = false;
  }

  calculateAdvancedIncomeForShift() {
    this.advanceCashAmount = this.advancedOrders.reduce((total, order) => {
      const cashPaid = parseFloat(order.cash_paid || '0');
      return isNaN(cashPaid) ? total : total + cashPaid;
    }, 0);

    this.advanceMpesaAmount = this.advancedOrders.reduce((total, order) => {
      const mpesaPaid = parseFloat(order.mpesa_paid || '0');
      return isNaN(mpesaPaid) ? total : total + mpesaPaid;
    }, 0);

    this.advanceBankAmount = this.advancedOrders.reduce((total, order) => {
      const bankPaid = parseFloat(order.bank_paid || '0');
      return isNaN(bankPaid) ? total : total + bankPaid;
    }, 0);
    this.advanceComplimentedOrders = this.advancedOrders.reduce(
      (total, order) => {
        const Complimentary_amount = parseFloat(
          order.complimentary_amount || '0'
        );
        return isNaN(Complimentary_amount)
          ? total
          : total + Complimentary_amount;
      },
      0
    );
    this.advancePaidWithVoucher = this.advancedOrders.reduce((total, order) => {
      const Voucher_amount = parseFloat(order.voucher_amount || '0');
      return isNaN(Voucher_amount) ? total : total + Voucher_amount;
    }, 0);

    // Calculate the total income by summing up all payment modes
    this.totalIncomee =
      this.cashAmount +
      this.bankAmount +
      this.mpesaAmount +
      this.complimentedOrders +
      this.paidWithVoucher +
      this.advanceBankAmount +
      this.advanceCashAmount +
      this.advanceMpesaAmount +
      this.advanceComplimentedOrders +
      this.advancePaidWithVoucher +
      this.creditSalesPaidWithBank +
      this.creditSalesPaidWithBankComplimentary +
      this.creditSalesPaidWithCash +
      this.creditSalesPaidWithMpesa;
    // console.log('total colected for the day', this.totalIncome)
  }

  calculateCreditSalesIcomeForShift() {
    this.creditSalesPaidWithMpesa = this.creditSalesPayments.reduce(
      (total, order) => {
        const mpesa_amount = parseFloat(order.mpesa_paid || '0');
        return isNaN(mpesa_amount) ? total : total + mpesa_amount;
      },
      0
    );
    this.creditSalesPaidWithCash = this.creditSalesPayments.reduce(
      (total, order) => {
        const cash_amount = parseFloat(order.cash_paid);
        return isNaN(cash_amount) ? total : total + cash_amount;
      },
      0
    );
    this.creditSalesPaidWithBank = this.creditSalesPayments.reduce(
      (total, order) => {
        const bank_amount = parseFloat(order.bank_paid || '0');
        return isNaN(bank_amount) ? total : total + bank_amount;
      },
      0
    );
    this.creditSalesPaidWithVoucher = this.creditSalesPayments.reduce(
      (total, order) => {
        const voucher_amount = parseFloat(order.voucher_amount || '0');
        return isNaN(voucher_amount) ? total : total + voucher_amount;
      },
      0
    );
    this.creditSalesPaidWithBankComplimentary = this.creditSalesPayments.reduce(
      (total, order) => {
        const complimentary_amount = parseFloat(
          order.complimentary_amount || '0'
        );
        return isNaN(complimentary_amount)
          ? total
          : total + complimentary_amount;
      },
      0
    );
    this.TotalCreditSalesPayed = this.creditSalesPayments.reduce(
      (total, order) => {
        const amount_paid = parseFloat(order.amount_paid || '0');
        return isNaN(amount_paid) ? total : total + amount_paid;
      },
      0
    );

    // console.log(" credit cash paid", this.creditSalesPaidWithCash);
    // console.log(" credit mpesa paid", this.creditSalesPaidWithMpesa);
    // console.log("credit bank paid", this.creditSalesPaidWithBank);
    // console.log("Total credit Sales Paid", this.TotalCreditSalesPayed);

    this.totalIncomee =
      this.cashAmount +
      this.bankAmount +
      this.mpesaAmount +
      this.complimentedOrders +
      this.paidWithVoucher +
      this.advanceBankAmount +
      this.advanceCashAmount +
      this.advanceMpesaAmount +
      this.advanceComplimentedOrders +
      this.advancePaidWithVoucher +
      this.creditSalesPaidWithBank +
      this.creditSalesPaidWithBankComplimentary +
      this.creditSalesPaidWithCash +
      this.creditSalesPaidWithMpesa;
    // console.log("Total credit Sales Paid", this.totalIncomee);
  }

  getAllOrdersByDateRange(startDate: Date, endDate: Date) {
    // this.shiftService.getAllShifts(startDate, endDate).subscribe((data: any[]) => {
    //   this.shifts = data;
    //   this.selectedShiftId = this.shifts[0].id;
    //   this.fetchOrdersForSelectedShift();
    //   this.fetchAdvancedOrdersForSelectedShift();
    //   this.fetchAdvancedOrdersPaymentsForSelectedShift();
    // });
  }

  getUniqueShiftsFromOrders(orders: any[]) {
    orders.map((order) => order.shift_id).reduce((a, b) => a.concat(b), []);
  }

  printReport() {
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      const content = `
      <html>
        <head>
          <title>Income Report</title>
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
              <h2>Income Report</h2>
            </div>

            <h2>Payments</h2>
            <table>
              <thead>
                <tr>
                  <th>Payment Mode</th>
                  <th>Amount Paid</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cash Paid</td>
                  <td>${
                    this.advanceCashAmount +
                    this.cashAmount +
                    this.creditSalesPaidWithCash
                  }</td>
                </tr>
                <tr>
                  <td>Bank Paid</td>
                  <td>${
                    this.advanceBankAmount +
                    this.bankAmount +
                    this.creditSalesPaidWithBank
                  }</td>
                </tr>
                <tr>
                  <td>Mpesa Paid</td>
                  <td>${
                    this.advanceMpesaAmount +
                    this.mpesaAmount +
                    this.creditSalesPaidWithMpesa
                  }</td>
                </tr>
                <tr>
                  <td>Complimentary Orders</td>
                  <td>${
                    this.advanceComplimentedOrders +
                    this.complimentedOrders +
                    this.creditSalesPaidWithBankComplimentary
                  }</td>
                </tr>
                <tr>
                  <td>Voucher Amount</td>
                  <td>${
                    this.advancePaidWithVoucher +
                    this.paidWithVoucher +
                    this.creditSalesPaidWithVoucher
                  }</td>
                </tr>
                <tr>
                  <td>Total Income</td>
                  <td>${this.totalIncomee}</td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
            Income Rerport Generated On ${new Date().toLocaleDateString()}
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
