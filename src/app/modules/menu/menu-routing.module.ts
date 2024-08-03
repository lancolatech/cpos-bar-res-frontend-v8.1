import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuOrderItemsComponent } from './components/menuTemplates/menu-order-items/menu-order-items.component';
import { MenuMainPageComponent } from './components/menu-main-page/menu-main-page.component';
import { MenuOrderStepsComponent } from './components/menuTemplates/menu-order-steps/menu-order-steps.component';
import { BookingsComponent } from './components/Bookings/bookings/bookings.component';

const routes: Routes = [
  {
    path:'',
    redirectTo:'main-page',
    pathMatch:'full'
  },
  {
    path: 'main-page/:orderId',
    component:MenuMainPageComponent
  },
  {
    path: 'main-page',
    component:MenuMainPageComponent
  },
  {
    path:'productss',
    component:MenuOrderStepsComponent
  },
  {
    path:'Bookings',
    component:BookingsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
