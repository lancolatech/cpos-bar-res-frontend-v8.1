import { Component } from '@angular/core';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { ShiftService } from '../../../services/shift.service';

@Component({
  selector: 'app-voided-orders-reports',
  templateUrl: './voided-orders-reports.component.html',
  styleUrls: ['./voided-orders-reports.component.scss']
})
export class VoidedOrdersReportsComponent {

  orders: any[] = [];
  shifts: any[] = []; // Array to hold all shifts
  selectedShiftId: number | null = null; // Track the selected shift ID

  shiftTotalSales: number = 0;
  itemsSold: any[] = [];

  constructor(private shiftService: ShiftService, private menuService: MenuService) {}

  ngOnInit(): void {
    this.loadAllShifts();
    this.subscribeToCurrentShift();
  }

  loadAllShifts() {
    this.shiftService.getAllShifts().subscribe((data: any[]) => {
      // Sort shifts by TimeStarted in descending order
      this.shifts = data.sort((a, b) => new Date(b.TimeStarted).getTime() - new Date(a.TimeStarted).getTime());
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
    if (this.selectedShiftId !== null) {
      console.log("Fetching orders for ShiftID:", this.selectedShiftId); // Check the ShiftID before fetching orders
  
      this.menuService.getPostedOrders().subscribe((data: any[]) => {
        console.log("All orders from service:", data); // Log all orders for debugging
        
        // Parse the 'Items' property of each order from string to an array of objects
        this.orders = data
          .filter((order) => order.ShiftID === +this.selectedShiftId! && order.confirm_delete === 1)
          .map((order) => ({
            ...order,
            Items: JSON.parse(order.Items) // Parse the 'Items' string into an array of objects
          }));

        console.log("Orders for the selected shift:", this.orders);
      });
    }
  }

  onShiftSelectionChange() {
    // Fetch orders for the newly selected shift
    this.fetchOrdersForSelectedShift();
  }
}
