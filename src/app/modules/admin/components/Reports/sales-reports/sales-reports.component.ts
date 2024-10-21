import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { ShiftService } from '../../../services/shift.service';
import { OrdersService } from 'src/app/modules/orders/services/orders.service';

@Component({
  selector: 'app-sales-reports',
  templateUrl: './sales-reports.component.html',
  styleUrls: ['./sales-reports.component.scss'],
})
export class SalesReportsComponent implements OnInit {
  orders: any[] = [];
  selectedRangeReports: any;
  filterOrders: any[] = [];
  advancedOrders: any[] = [];
  CreditSales: any[] = [];
  usersSales: { [key: string]: number } = {};
  shifts: any[] = [];
  selectedShiftId: string = '';
  loading: boolean = true;

  shiftTotalSales: number = 0;
  totalSales: number = 0;
  normalSales: number = 0;
  shiftAvancedTotalSales: number = 0;
  shiftCreditTotalSales: number = 0;
  itemsSold: any[] = [];
  advanceItemsSold: any[] = [];
  startDate: Date | null = null;
  endDate: Date | null = null;
  shiftRepots: boolean = true;

  constructor(
    private shiftService: ShiftService,
    private menuService: MenuService,
    private orderServive: OrdersService
  ) {}

  ngOnInit(): void {
    this.loadAllShifts();
    this.subscribeToCurrentShift();
    console.log('start day:', this.startDate);
    console.log('end day:', this.endDate);
    // this.fetchOrdersForSelectedTimeRange();
    // this.fetchAdvanceOrdersForSelectedShift();
    // this.fetchCreditSalesForSelectedShift();

    // Fetch orders based on the initial start and end dates
    // this.searchOrdersByDateTimeRange();
  }

  loadAllShifts() {
    this.shiftService.getAllShifts().subscribe((data: any[]) => {
      this.shifts = data.sort(
        (a, b) =>
          new Date(b.TimeStarted).getTime() - new Date(a.TimeStarted).getTime()
      );
      this.loading = false;
    });
  }

  subscribeToCurrentShift() {
    this.shiftService.currentShift$.subscribe((shift) => {
      this.shiftRepots = true;
      this.selectedShiftId = shift?.id ?? null;
      if (this.selectedShiftId !== null) {
        this.fetchOrdersForSelectedShift();
        // this.fetchAdvancedOrdersPaymentsForSelectedShift();
        // this.fetchCreditSalesPaymentsForSelectedShift();
        this.fetchCreditSalesForSelectedShift();
        this.fetchAdvanceOrdersForSelectedShift();
        this.totalSales = this.shiftAvancedTotalSales + this.shiftTotalSales;
      }
    });
  }

  fetchOrdersForSelectedShift() {
    if (this.selectedShiftId !== null) {
      this.menuService
        .getPostedOrdersForAShift(this.selectedShiftId)
        .subscribe((data: any) => {
          this.shiftRepots = true;
          this.orders = data.orders;
          this.shiftTotalSales = data.totalSales;
          this.totalSales = this.shiftAvancedTotalSales + this.shiftTotalSales;
          console.log('orders for the shift totals', this.shiftTotalSales);
          this.normalSales = this.shiftTotalSales - this.shiftCreditTotalSales;
          this.usersSales = data.userSales;
          console.log('Normal sale for the shift totals', this.normalSales);
          console.log('waiters sales', this.usersSales);
          this.loading = false;
          this.extractItemsForCurrentShiftOrders();
        });
    }
  }
  fetchCreditSalesForSelectedShift() {
    if (this.selectedShiftId !== null) {
      this.menuService
        .getCreditSalesForAShift(this.selectedShiftId)
        .subscribe((data: any) => {
          this.CreditSales = data.creditSales;
          this.shiftCreditTotalSales = data.totalCreditSales;
          console.log(
            'Credit sales for  the shift totals',
            this.shiftCreditTotalSales,
            ' for',
            this.selectedShiftId
          );
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
          this.shiftAvancedTotalSales = data.totalSales;
          // this.usersSales = data.userSales;
          // console.log('waiters sales', this.usersSales);
          this.extractItemsForCurrentShiftAdvancedOrders();
        });
    }
  }

  fetchOrdersForSelectedTimeRange() {
    if (this.startDate && this.endDate) {
      this.selectedShiftId = '';
      this.clearData();
      this.menuService
        .getPostedOrdersForSelectedTimeRange(this.startDate!, this.endDate!)
        .subscribe((data: any) => {
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
          this.totalSales = allShiftTotalSales;
          console.log('Total sales for all shifts:', this.totalSales);
        });
      this.shiftRepots = false;
      this.loading = false;
    }
  }

  clearData() {
    this.orders = [];
    this.filterOrders = [];
    this.advancedOrders = [];
    this.CreditSales = [];
    this.usersSales = {};
    this.shiftTotalSales = 0;
    this.totalSales = 0;
    this.normalSales = 0;
    this.shiftAvancedTotalSales = 0;
    this.shiftCreditTotalSales = 0;
    this.normalSales = 0;
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

  getUsersSalesArray() {
    return Object.entries(this.usersSales).map(([name, sales]) => ({
      name,
      sales,
    }));
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
          this.calculateShiftAdvancedTotalSales();
          this.extractItemsForCurrentShiftAdvancedOrders();
        });

        this.orderServive.getAllCreditSales().subscribe((data: any[]) => {
          this.CreditSales = data.filter(
            (order) =>
              !order.deleted &&
              this.isOrderInDateTimeRange(
                order,
                adjustedStartDate,
                adjustedEndDate
              )
          );
          this.calculateShiftCreditTotalSales();
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
          this.calculateShiftTotalSales();
          this.extractItemsForCurrentShiftOrders();
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

  fetchAdvancedOrdersPaymentsForSelectedShift() {
    if (this.selectedShiftId !== null) {
      this.orderServive.getAdvanceOrders().subscribe((data: any[]) => {
        this.advancedOrders = data.filter(
          (order) => order.shift_id === +this.selectedShiftId! && !order.deleted
        );
        this.calculateShiftAdvancedTotalSales();
        this.extractItemsForCurrentShiftOrders();
      });
    }
  }

  fetchCreditSalesPaymentsForSelectedShift() {
    if (this.selectedShiftId !== null) {
      this.orderServive.getAllCreditSales().subscribe((data: any[]) => {
        this.CreditSales = data.filter(
          (order) => order.shift_id === +this.selectedShiftId!
        );
        this.calculateShiftCreditTotalSales();
      });
    }
  }

  calculateShiftTotalSales() {
    this.shiftTotalSales = this.orders.reduce(
      (total, order) => total + parseFloat(order.Total),
      0
    );
  }

  calculateShiftAdvancedTotalSales() {
    this.shiftAvancedTotalSales = this.advancedOrders.reduce(
      (total, order) => total + parseFloat(order.Total),
      0
    );
  }

  calculateShiftCreditTotalSales() {
    this.shiftCreditTotalSales = this.CreditSales.reduce(
      (total, order) => total + parseFloat(order.credit_amount),
      0
    );
  }

  extractItemsForCurrentShiftOrders() {
    const itemsMap = new Map<string, any>();
    console.log('Shifts oRDERS goten to map items', this.orders);
    this.orders.forEach((order: any) => {
      const items = order.Items;
      items.forEach((item: any) => {
        console.log('all order normal items', items);

        const itemName = item.name;
        if (itemsMap.has(itemName)) {
          const existingItem = itemsMap.get(itemName);
          existingItem.selectedItems += item.selectedItems;
        } else {
          itemsMap.set(itemName, { ...item });
        }
      });
    });
    this.itemsSold = Array.from(itemsMap.values());
    console.log('all order normal items', this.itemsSold);
  }

  extractItemsForCurrentShiftAdvancedOrders() {
    const itemsMap = new Map<string, any>();
    this.advancedOrders.forEach((order: any) => {
      if (order.items && order.items.length > 0) {
        const items = order.Items;
        items.forEach((item: any) => {
          const itemName = item.name;
          if (itemsMap.has(itemName)) {
            const existingItem = itemsMap.get(itemName);
            existingItem.selectedItems += item.selectedItems;
          } else {
            itemsMap.set(itemName, { ...item });
          }
        });
      }
    });
    this.advanceItemsSold = Array.from(itemsMap.values());
    console.log('all order items', this.advanceItemsSold);
  }

  onShiftSelectionChange() {
    this.clearData();
    this.startDate = null;
    this.endDate = null;
    this.fetchOrdersForSelectedShift();
    // this.fetchAdvancedOrdersPaymentsForSelectedShift();
    // this.fetchCreditSalesPaymentsForSelectedShift();
    this.fetchAdvanceOrdersForSelectedShift();
    this.fetchCreditSalesForSelectedShift();
    this.totalSales = this.shiftAvancedTotalSales + this.shiftTotalSales;
    this.normalSales = this.shiftTotalSales - this.shiftCreditTotalSales;
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
                    <td>Normal Sales</td>
                    <td>${
                      this.shiftTotalSales - this.shiftCreditTotalSales
                    }</td>
                  </tr>
                  <tr>
                    <td>Credit Sales</td>
                    <td>${this.shiftCreditTotalSales}</td>
                  </tr>
                  <tr>
                    <td>Advance Order sales </td>
                    <td>${this.shiftAvancedTotalSales}</td>
                  </tr>
  
                  <tr>
                    <td>Total Sales</td>
                    <td>${
                      this.shiftTotalSales + this.shiftAvancedTotalSales
                    }</td>
                  </tr>
                </tbody>
              </table>
  
              <h2>Items Sold</h2>
              <table>
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.itemsSold
                    .map(
                      (item) => `
                    <tr>
                      <td>${item.name}</td>
                      <td>${item.selectedItems}</td>
                      <td>Ksh. ${item.price}</td>
                      <td>Ksh. ${item.price * item.selectedItems}</td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
  
              <div class="footer">
                Sales Rerport Generated On ${new Date().toLocaleDateString()}
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
