import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { OrdersService } from 'src/app/modules/orders/services/orders.service';

@Component({
  selector: 'app-display-credit-sales',
  templateUrl: './display-credit-sales.component.html',
  styleUrls: ['./display-credit-sales.component.scss'],
})
export class DisplayCreditSalesComponent implements OnInit {
  orders: any[] = [];
  normalOrder: any;
  selectedOrderId: string = '';
  isOpen: boolean = false;
  isOrderModalOpen: boolean = false;
  selectedCreditSaleId: number | null = null;
  itemsArray: any[] = [];
  constructor(
    private ordersService: OrdersService,
    private menuService: MenuService
  ) {}
  ngOnInit(): void {
    this.getAllCreditSales();
    // this.getOrderDetailsById(this.selectedOrderId!)
  }
  getAllCreditSales() {
    this.ordersService.getAllCreditSales().subscribe((orders) => {
      this.orders = orders.sales;
      console.log('All credit sales', this.orders);

      // this.orders = orders;

      console.log(this.orders);
    });
  }
  getOrderDetailsById(normalOrder: string): Observable<any> {
    return this.menuService.getOrderDetailsById(normalOrder);
  }

  openOrderDetailsModal(normalOrder: string): void {
    this.isOrderModalOpen = true;
    this.selectedOrderId = normalOrder; // Store the selected order ID

    // Fetch order details first
    this.getOrderDetailsById(this.selectedOrderId!).subscribe((order) => {
      this.normalOrder = order;
      console.log('Order Details', this.normalOrder);

      // Now, parse the Items property
      this.itemsArray = this.normalOrder.Items;
      console.log('Items for the order', this.itemsArray);
    });
  }

  openModal(creditSaleId: number): void {
    this.isOpen = true;
    this.selectedCreditSaleId = creditSaleId; // Store the selected credit sale ID
  }

  closeModal(): void {
    this.isOpen = false;
    this.selectedCreditSaleId = null; // Clear the selected credit sale ID when closing the modal
    this.getAllCreditSales();
  }

  closeOrderDetailsModal(): void {
    this.isOrderModalOpen = false;
    this.normalOrder = null; // Clear the selected credit sale ID when closing the modal
  }
}
