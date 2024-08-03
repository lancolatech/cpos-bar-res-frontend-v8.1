import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationComponent } from './components/reservation/reservation.component';
import { ReservationCardComponent } from './components/reservationTemplates/reservation-card/reservation-card.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'main-page',
    pathMatch:'full'
  },
  {
    path:'main-page',
    component:ReservationComponent
  },
  {
    path:'reservation-orders',
    component:ReservationCardComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservationsRoutingModule { }
