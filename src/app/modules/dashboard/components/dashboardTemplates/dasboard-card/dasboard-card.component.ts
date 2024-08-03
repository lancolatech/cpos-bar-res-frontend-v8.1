import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ShiftService } from 'src/app/modules/admin/services/shift.service';
import { MenuService } from 'src/app/modules/menu/services/menu.service';

@Component({
  selector: 'app-dasboard-card',
  templateUrl: './dasboard-card.component.html',
  styleUrls: ['./dasboard-card.component.scss'],
})
export class DasboardCardComponent implements OnInit, OnChanges {
  totalIncomeCollected: number = 0;
  totalCashPayments: number = 0;
  totalMpesaPayments: number = 0;
  totalBankPayments: number = 0;
  totalIncomeCollectedCreditSales: number = 0;
  totalCashPaymentsCreditSales: number = 0;
  totalMpesaPaymentsCreditSales: number = 0;
  totalBankPaymentsCreditSales: number = 0;
  numberOfCompleteOrders: number = 0;

  @Input() selectedShiftId: string = '';

  constructor(
    private menuService: MenuService,
    private shiftService: ShiftService
  ) {}

  ngOnInit() {
    this.generateReports();
    // console.log('card recived id',this.selectedShiftId)
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedShiftId'] && !changes['selectedShiftId'].firstChange) {
      // If selectedShiftId changes and it's not the initial change
      this.generateReports();
      // console.log('card recived on change id',this.selectedShiftId)
    }
  }
  generateReports() {
    this.shiftService.currentShift$.subscribe((shift) => {
      if (shift) {
        this.fetchCreditSalesForSelectedShift(shift.id);
        this.fetchOrdersForSelectedShift(shift.id);
      } else {
        console.error('No current shift found');
        // Handle scenario where no shift is found
      }
    });
  }

  fetchOrdersForSelectedShift(shiftId: string) {
    if (shiftId !== null) {
      this.menuService
        .getPostedOrdersForAShift(this.selectedShiftId)
        .subscribe((data: any) => {
          const orders = data.orders;
          const selectedShiftReports = data;
          this.totalBankPayments = selectedShiftReports.paymentModes.bank;
          this.totalCashPayments = selectedShiftReports.paymentModes.cash;
          this.totalMpesaPayments = selectedShiftReports.paymentModes.mpesa;
          this.totalIncomeCollected =
            selectedShiftReports.paymentModes.totalIncome;
          console.log('Data reports for selected shift:', data);
        });
    }
  }
  fetchCreditSalesForSelectedShift(shiftId: string) {
    if (shiftId !== null) {
      this.menuService
        .getCreditSalesPaymentsForAShift(this.selectedShiftId)
        .subscribe((data: any) => {
          const selectedShiftCreditSalesReports = data;
          this.totalBankPaymentsCreditSales = data.creditPaymentModes.bank;
          this.totalCashPaymentsCreditSales = data.creditPaymentModes.cash;
          this.totalMpesaPaymentsCreditSales = data.creditPaymentModes.mpesa;

          this.totalIncomeCollectedCreditSales =
            data.creditPaymentModes.totalIncome;
          console.log('Data for selected shift:', data);
          // this.usersSales = data.userSales;
          // console.log('waiters sales', this.usersSales);
        });
    }
  }
}
