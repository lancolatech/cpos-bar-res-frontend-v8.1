import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { ShiftService } from '../../../services/shift.service';
import { OrdersService } from 'src/app/modules/orders/services/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-credit-sales-reports',
  templateUrl: './credit-sales-reports.component.html',
  styleUrls: ['./credit-sales-reports.component.scss'],
})
export class CreditSalesReportsComponent implements OnInit {
  orders: any[] = [];
  ordersPayments: any[] = [];
  shifts: any[] = []; // Array to hold all shifts
  selectedShiftId: string = ''; // Track the selected shift ID

  shiftTotalSales: number = 0;
  creditSalesId: number = 0;
  itemsSold: any[] = [];
  isOpen: boolean = false;
  loading: boolean = true;

  constructor(
    private shiftService: ShiftService,
    private orderService: OrdersService,
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.loadAllShifts();
    this.subscribeToCurrentShift();
  }

  loadAllShifts() {
    this.shiftService.getAllShifts().subscribe((data: any[]) => {
      // Sort shifts by TimeStarted in descending order
      this.shifts = data.sort(
        (a, b) =>
          new Date(b.TimeStarted).getTime() - new Date(a.TimeStarted).getTime()
      );
      console.log('All shifts', this.shifts);
    });
  }

  subscribeToCurrentShift() {
    this.shiftService.currentShift$.subscribe((shift) => {
      this.selectedShiftId = shift?.id ?? null; // Update the selectedShiftId when currentShift changes
      if (this.selectedShiftId !== null) {
        this.fetchOrdersForSelectedShift();
      }
    });
  }

  fetchOrdersForSelectedShift() {
    if (this.selectedShiftId !== '') {
      console.log('Fetching orders for ShiftID:', this.selectedShiftId); // Check the ShiftID before fetching orders

      this.menuService
        .getCreditSalesForAShift(this.selectedShiftId)
        .subscribe((data: any) => {
          this.orders = data.creditSales;
          this.shiftTotalSales = data.totalCreditSales;
          console.log('Orders for the selected shift:', this.orders);

          this.calculateShiftTotalSales();
          // this.isPaymentOverdue(this.orders.payment_date);
          this.orders.forEach((order) => {
            const isOverdue = this.isPaymentOverdue(order.payment_date);
            console.log('Overdue:', isOverdue);
          });
          this.loading = false;
        });
    }
  }
  isPaymentOverdue(paymentDate: string): boolean {
    const currentDate = new Date();
    const dueDate = new Date(paymentDate);

    return currentDate > dueDate;
  }

  fetchAllUnpaidCreditSales() {
    this.loading = true;
    this.menuService.getAllUnpaidCreditSales().subscribe((data) => {
      this.orders = data.sales;
      this.shiftTotalSales = data.totalCreditSales;
      this.loading = false;
      // console.log('Orders for the selected shift:', this.orders);
    });
  }

  calculateShiftTotalSales() {
    // Calculate total sales for the current shift
    this.shiftTotalSales = this.orders.reduce((total, order) => {
      return total + parseFloat(order.credit_amount);
    }, 0);
  }

  onShiftSelectionChange() {
    // Fetch orders for the newly selected shift
    this.fetchOrdersForSelectedShift();
  }

  viewAllCreditSales() {
    this.isOpen = false;
    // Fetch all credit sales
    this.orderService.getAllCreditSales().subscribe((data: any[]) => {
      this.orders = data.filter((order) => !order.fully_paid);
      this.calculateShiftTotalSales();
    });
  }

  viewCreditSalesForToday() {
    this.isOpen = false;
    this.loading = true;

    if (this.selectedShiftId !== null) {
      // Fetch credit sales for the selected shift
      this.fetchOrdersForSelectedShift();
    }
  }

  viewOverdueCreditSales() {
    this.isOpen = false;
    this.loading = true;
    if (this.selectedShiftId !== null) {
      // Fetch credit sales for the selected shift and filter overdue orders
      this.menuService.getAllUnpaidCreditSales().subscribe((data: any) => {
        this.orders = data.sales.filter(
          (order: any) =>
            this.isPaymentOverdue(order.payment_date) && !order.fully_paid
        );
        console.log('overdue credit sales', this.orders);
        this.loading = false;
        this.calculateShiftTotalSales();
      });
    }
  }
  viewFullyPaidCreditSales() {
    this.isOpen = false;
    this.loading = true;
    if (this.selectedShiftId !== null) {
      // Fetch credit sales for the selected shift and filter overdue orders
      this.menuService
        .getCreditSalesForAShift(this.selectedShiftId)
        .subscribe((data: any) => {
          console.log('data', data);
          this.orders = data.paidCreditSales;
          console.log('all paid orders for the shift', this.orders);
          this.calculateShiftTotalSales();
          this.loading = false;
        });
    }
  }

  startToCreditSalesOrder(orderId: string) {
    this.router.navigate(['/orders/credit_sales_payment', orderId]);
  }

  getAllPaymentsOfCreditSales(creditSalesId: number) {
    console.log('id:', creditSalesId);
    this.orderService.getAllCreditSalesPayments().subscribe((data: any[]) => {
      console.log('All order paymentsfff:', data);
      this.ordersPayments = data.filter(
        (order) => order.credit_sale_id === creditSalesId
      );
      console.log('All order payments:', this.ordersPayments);
      this.openModal();
    });
  }

  trackPaymentsOfCreditsales(creditSalesId: number) {
    this.getAllPaymentsOfCreditSales(creditSalesId);
  }

  openModal() {
    this.isOpen = true;
  }
  closeModal() {
    this.isOpen = false;
  }
}
