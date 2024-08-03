import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersMainComponent } from './components/orders-main/orders-main.component';
import { OrderCardComponent } from './components/order-card/order-card.component';
import { FormsModule } from '@angular/forms';
import { OrderPaymentCardComponent } from './components/order-payment-card/order-payment-card.component';
import { OrderPaymentInputComponent } from './components/order-payment-input/order-payment-input.component';
import { OrderPaymentScannerComponent } from './components/order-payment-scanner/order-payment-scanner.component';
import { EditOrdersComponent } from './components/edit-orders/edit-orders.component';
import { MenuModule } from '../menu/menu.module';
import { MenuOrderItemsComponent } from '../menu/components/menuTemplates/menu-order-items/menu-order-items.component';
import { OrderPaymentComponent } from './components/order-payment/order-payment.component';
import { AdvancedOrdersComponent } from './components/advanced-orders/advanced-orders.component';
import { ShowAdvanceOrdersComponent } from './components/show-advance-orders/show-advance-orders.component';
import { AdvancedOrdersPaymentComponent } from './components/advanced-orders-payment/advanced-orders-payment.component';
import { AdvanceOrderPaymentTrakingComponent } from './components/advance-order-payment-traking/advance-order-payment-traking.component';
import { MakeCreditSalesComponent } from './components/advance-order-payment-traking/credit sales/make-credit-sales/make-credit-sales.component';
import { DisplayCreditSalesComponent } from './components/advance-order-payment-traking/credit sales/display-credit-sales/display-credit-sales.component';
import { RegisterCustomerComponent } from '../admin/components/customers/register-customer/register-customer.component';
import { CreditSalesPaymentComponent } from './components/advance-order-payment-traking/credit sales/credit-sales-payment/credit-sales-payment.component';
import { PreLoaderComponent } from 'src/app/shared/pre-loader/pre-loader.component';
@NgModule({
  declarations: [
    OrdersMainComponent,
    OrderCardComponent,
    OrderPaymentCardComponent,
    OrderPaymentInputComponent,
    OrderPaymentScannerComponent,
    EditOrdersComponent,
    OrderPaymentComponent,
    AdvancedOrdersComponent,
    ShowAdvanceOrdersComponent,
    AdvancedOrdersPaymentComponent,
    AdvanceOrderPaymentTrakingComponent,
    MakeCreditSalesComponent,
    DisplayCreditSalesComponent,
    CreditSalesPaymentComponent,

    // MenuOrderItemsComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    FormsModule,
    MenuModule,
    RegisterCustomerComponent,
    PreLoaderComponent,
  ],
})
export class OrdersModule {}
