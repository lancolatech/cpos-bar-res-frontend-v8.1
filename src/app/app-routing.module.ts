import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AuthGuard } from './shared/guards/auth/auth.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginGuard } from './shared/guards/login/login.guard';
import { ResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';
import { landingPage } from './shared/data/landing-page.data';
import { ShiftsComponent } from './modules/admin/components/shifts/shifts.component';
import { TablesComponent } from './modules/admin/components/tables/tables.component';
import { SalesReportsComponent } from './modules/admin/components/Reports/sales-reports/sales-reports.component';
import { IncomeReportsComponent } from './modules/admin/components/Reports/income-reports/income-reports.component';
import { CreditSalesReportsComponent } from './modules/admin/components/Reports/credit-sales-reports/credit-sales-reports.component';
import { AddPettyCashComponent } from './modules/admin/components/PettyCash/add-petty-cash/add-petty-cash.component';
import { InventoryReportsComponent } from './modules/admin/components/Reports/inventory-reports/inventory-reports.component';
import { InventoryComponent } from './modules/admin/components/inventory/inventory.component';
import { DisplayInventoryComponent } from './modules/admin/components/display-inventory/display-inventory.component';
import { RecipeIngridientsReportsComponent } from './modules/admin/components/Reports/recipe-ingridients-reports/recipe-ingridients-reports.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        // redirectTo: landingPage,
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        data: { expectedRole: 'ADMIN' }, // Set expected roles for each route
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'menu',
        canActivate: [AuthGuard],
        data: { expectedRole: 'WAITER' }, // Restricted to WAITER role
        loadChildren: () =>
          import('./modules/menu/menu.module').then((m) => m.MenuModule),
      },
      {
        path: 'orders',
        canActivate: [AuthGuard],
        data: { expectedRole: 'WAITER' }, // Restricted to WAITER role
        loadChildren: () =>
          import('./modules/orders/orders.module').then((m) => m.OrdersModule),
      },
      {
        path: 'reservations',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./modules/reservations/reservations.module').then(
            (m) => m.ReservationsModule
          ),
      },
      {
        path: 'admin',
        canActivate: [AuthGuard],
        data: { expectedRole: 'WAITER' }, // Restricted to WAITER role
        loadChildren: () =>
          import('./modules/admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'users',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./modules/users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'reset-password',
        canActivate: [AuthGuard],
        component: ResetPasswordComponent,
      },

      {
        path: 'shifts',
        canActivate: [AuthGuard],
        data: { expectedRole: 'WAITER' }, // Restricted to WAITER role
        component: ShiftsComponent,
      },
      {
        path: 'add_petty_cash',
        canActivate: [AuthGuard],
        data: { expectedRole: 'SALES' }, // Restricted to WAITER role
        component: AddPettyCashComponent,
      },
      {
        path: 'sales_reports',
        canActivate: [AuthGuard],
        data: { expectedRole: 'SALES' }, // Restricted to WAITER role
        component: SalesReportsComponent,
      },

      {
        path: 'credit_sales_report',
        canActivate: [AuthGuard],
        data: { expectedRole: 'SALES' }, // Restricted to WAITER role
        component: CreditSalesReportsComponent,
      },
      {
        path: 'inventory_reports',
        canActivate: [AuthGuard],
        data: { expectedRole: 'SALES' }, // Restricted to WAITER role
        component: InventoryReportsComponent,
      },
      {
        path: 'income_reports',
        canActivate: [AuthGuard],
        data: { expectedRole: 'SALES' }, // Restricted to WAITER role
        component: IncomeReportsComponent,
      },
      {
        path: 'stock',
        canActivate: [AuthGuard],
        data: { expectedRole: 'SALES' }, // Restricted to WAITER role
        component: DisplayInventoryComponent,
      },
      {
        path: 'inventory',
        canActivate: [AuthGuard],
        data: { expectedRole: 'SALES' }, // Restricted to WAITER role
        component: InventoryComponent,
      },

      {
        path: 'tables',
        data: { expectedRole: 'WAITER' }, // Restricted to WAITER role
        canActivate: [AuthGuard],
        component: TablesComponent,
      },

      {
        path: 'income-report',
        data: { expectedRole: 'WAITER' }, // Restricted to WAITER role
        canActivate: [AuthGuard],
        component: IncomeReportsComponent,
      },

      {
        path: 'recipe-report',
        data: { expectedRole: 'WAITER' }, // Restricted to WAITER role
        canActivate: [AuthGuard],
        component: RecipeIngridientsReportsComponent,
      },
      {
        path: 'Credit_sales_report',
        data: { expectedRole: 'WAITER' }, // Restricted to WAITER role
        canActivate: [AuthGuard],
        component: CreditSalesReportsComponent,
      },
    ],
  },
  {
    path: '',
    canActivate: [LoginGuard],
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/auth/auth.module').then((m) => m.AuthModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
