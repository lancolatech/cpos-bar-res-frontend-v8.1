import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReservationsRoutingModule } from './reservations-routing.module';
import { ReservationComponent } from './components/reservation/reservation.component';
import { ReservationCalendarComponent } from './components/reservationTemplates/reservation-calendar/reservation-calendar.component';
import { ReservationCardComponent } from './components/reservationTemplates/reservation-card/reservation-card.component';
import { ReservationTableManagementComponent } from './components/reservationTemplates/reservation-table-management/reservation-table-management.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ReservationComponent,
    ReservationCalendarComponent,
    ReservationCardComponent,
    ReservationTableManagementComponent
  ],
  imports: [
    CommonModule,
    ReservationsRoutingModule,
    FormsModule
  ]
})
export class ReservationsModule { }
