import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DasboardCardComponent } from './components/dashboardTemplates/dasboard-card/dasboard-card.component';
import { DayUpsaleCardComponent } from './components/dashboardTemplates/day-upsale-card/day-upsale-card.component';
import { GraphCardComponent } from './components/dashboardTemplates/graph-card/graph-card.component';
// import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';


@NgModule({
  declarations: [
    DashboardComponent,
   GraphCardComponent,
   DasboardCardComponent,
   DayUpsaleCardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    CanvasJSAngularChartsModule
  ]
})
export class DashboardModule { }
