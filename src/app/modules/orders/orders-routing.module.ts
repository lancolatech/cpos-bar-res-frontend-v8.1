import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersMainComponent } from './components/orders-main/orders-main.component';
import { OrderPaymentCardComponent } from './components/order-payment-card/order-payment-card.component';
import { OrderPaymentInputComponent } from './components/order-payment-input/order-payment-input.component';
import { OrderPaymentScannerComponent } from './components/order-payment-scanner/order-payment-scanner.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { EditOrdersComponent } from './components/edit-orders/edit-orders.component';
import { OrderPaymentComponent } from './components/order-payment/order-payment.component';
import { AdvancedOrdersComponent } from './components/advanced-orders/advanced-orders.component';
import { ShowAdvanceOrdersComponent } from './components/show-advance-orders/show-advance-orders.component';
import { AdvancedOrdersPaymentComponent } from './components/advanced-orders-payment/advanced-orders-payment.component';
import { AdvanceOrderPaymentTrakingComponent } from './components/advance-order-payment-traking/advance-order-payment-traking.component';
import { MakeCreditSalesComponent } from './components/advance-order-payment-traking/credit sales/make-credit-sales/make-credit-sales.component';
import { DisplayCategoriesComponent } from '../admin/components/display-categories/display-categories.component';
import { DisplayCreditSalesComponent } from './components/advance-order-payment-traking/credit sales/display-credit-sales/display-credit-sales.component';
import { CreditSalesPaymentComponent } from './components/advance-order-payment-traking/credit sales/credit-sales-payment/credit-sales-payment.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'orders-main',
    pathMatch:'full'
  },
  {
    path:'orders-main',
    component:OrdersMainComponent
  },
  {
    path:'orders-payment-card',
    component:OrderPaymentCardComponent
  },
  {
    path:'orders-card',
    component:OrderCardComponent
  },
  {
    path:'orders-payment-input',
    component:OrderPaymentInputComponent
  },
  {
    path:'orders-payment-scanner',
    component:OrderPaymentScannerComponent
  },
  {
    path:'payments',
    component:OrderPaymentComponent
  },
  {
    path: 'edit-orders', // Empty path for EditOrdersComponent
    component: EditOrdersComponent,
  },
  {
    path: 'advance_orders', // Empty path for EditOrdersComponent
    component: AdvancedOrdersComponent,
  },
  {
    path: 'show_advaced_orders', // Empty path for EditOrdersComponent
    component: ShowAdvanceOrdersComponent,
  },
  {
    path: 'advaced_orders_payment/:orderId', // Empty path for EditOrdersComponent
    component: AdvancedOrdersPaymentComponent,
  },
  {
    path: 'trackPayments/:orderId', // Empty path for EditOrdersComponent
    component: AdvanceOrderPaymentTrakingComponent,
  },
  {
    path: 'creditSales/:orderId', // Empty path for EditOrdersComponent
    component: MakeCreditSalesComponent,
  },
  {
    path: 'displayCreditSales', // Empty path for EditOrdersComponent
    component: DisplayCreditSalesComponent,
  },
  {
    path: 'credit_sales_payment/:orderId', // Empty path for EditOrdersComponent
    component: CreditSalesPaymentComponent,
  },
  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
