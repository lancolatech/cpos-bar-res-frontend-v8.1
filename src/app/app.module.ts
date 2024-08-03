import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavLinkButtonsComponent } from './layouts/main-layout/layoutTemplates/nav-link-buttons/nav-link-buttons.component';
import { DishesToOrderComponent } from './layouts/main-layout/layoutTemplates/dishes-to-order/dishes-to-order.component';
import { RightBarComponent } from './layouts/main-layout/layoutTemplates/right-bar/right-bar.component';
import { MenuOrderItemsComponent } from './layouts/main-layout/layoutTemplates/menu-order-items/menu-order-items.component';
import { MenuOrderStepsComponent } from './layouts/main-layout/layoutTemplates/menu-order-steps/menu-order-steps.component';
import { MenuBottomNavComponent } from './layouts/main-layout/layoutTemplates/menu-bottom-nav/menu-bottom-nav.component';
// import { NgChartsModule } from 'ng2-charts';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpClientXsrfModule,
} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { CalendarModule } from 'angular-calendar';
import { GraphCardComponent } from './modules/dashboard/components/dashboardTemplates/graph-card/graph-card.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ApiInterceptorService } from './shared/services/api-interceptor/api-interceptor.service';
import { HotToastModule } from '@ngneat/hot-toast';
import { PreLoaderComponent } from './shared/pre-loader/pre-loader.component';
import { ButtonLoaderComponent } from './shared/components/button-loader/button-loader.component';

// import { LeftSideNavTemplateComponent } from './layouts/main-layout/layoutTemplates/left-side-nav-template/left-

@NgModule({
  declarations: [
    AppComponent,
    NavLinkButtonsComponent,
    DishesToOrderComponent,
    RightBarComponent,
    MenuOrderItemsComponent,
    MenuOrderStepsComponent,
    MenuBottomNavComponent,
    // ButtonLoaderComponent,
    // PreLoaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // NgChartsModule,
    NgxSpinnerModule,
    FormsModule,
    HttpClientModule,
    CalendarModule,
    ToastrModule.forRoot(),
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    }),
    HotToastModule.forRoot(),
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptorService,
      multi: true,
    },
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
