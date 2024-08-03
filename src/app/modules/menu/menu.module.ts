import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { RightBarComponent } from './components/menuTemplates/right-bar/right-bar.component';
import { MenuOrderStepsComponent } from './components/menuTemplates/menu-order-steps/menu-order-steps.component';
import { MenuBottomNavComponent } from './components/menuTemplates/menu-bottom-nav/menu-bottom-nav.component';
import { MenuMainPageComponent } from './components/menu-main-page/menu-main-page.component';
import { MenuOrderItemsComponent } from './components/menuTemplates/menu-order-items/menu-order-items.component';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { BookingsComponent } from './components/Bookings/bookings/bookings.component';
import { BookingOrdersComponent } from './components/Bookings/booking-orders/booking-orders.component';


@NgModule({
  declarations: [
    MenuOrderStepsComponent,
    MenuBottomNavComponent,
    MenuMainPageComponent,
    MenuOrderItemsComponent,
    BookingsComponent,
    BookingOrdersComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    RightBarComponent,
    FormsModule,
    ToastrModule.forRoot(),
  ]
})
export class MenuModule { }
