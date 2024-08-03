import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-advance-order-payment-traking',
  templateUrl: './advance-order-payment-traking.component.html',
  styleUrls: ['./advance-order-payment-traking.component.scss']
})
export class AdvanceOrderPaymentTrakingComponent implements OnInit {
  advancedOrdersPayments:any;
  advancedOrderId:any;
  constructor (
    private orderServive:OrdersService,
    private route:ActivatedRoute,
    
    

  ){}
ngOnInit(): void {
  this.route.params.subscribe(params => {
    // Retrieve the order ID from the route parameters
    this.advancedOrderId = +params['orderId'];
    // Log the order ID for debugging purposes
  });
  this.fetchAdvancedOrdersPayments();
}


  fetchAdvancedOrdersPayments() {
    this.orderServive.getAdvanceOrdersPayments().subscribe((data: any[]) => {
      console.log("All orders payments advanced from service:", data); // Log all orders for debugging
      this.advancedOrdersPayments = data.filter((order) => order.advanced_order_id  === +this.advancedOrderId!);
      console.log("Orders advanced payments for the selected shift:", this.advancedOrdersPayments);

      // this.calculateAdvancedIncomeForShift();
    });
  }

}
