import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { LoginComponent } from '../auth/login/login.component';
import { RegisterUsersComponent } from './components/register-users/register-users.component';
import { AddProductFormComponent } from './components/add-product-form/add-product-form.component';

import { DisplayCategoriesComponent } from './components/display-categories/display-categories.component';
import { DisplayProductsComponent } from './components/display-products/display-products.component';

import { AddCategoryComponent } from './components/add-category/add-category.component';
import { DisplayReservationsComponent } from './components/display-reservations/display-reservations.component';
import { ShiftsComponent } from './components/shifts/shifts.component';
import { TablesComponent } from './components/tables/tables.component';
import { AdminTableComponent } from './components/admin-table/admin-table.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { EditProductsComponent } from './components/edit-products/edit-products.component';
import { EditUsersComponent } from './components/edit-users/edit-users.component';
import { SalesReportsComponent } from './components/Reports/sales-reports/sales-reports.component';
import { IncomeReportsComponent } from './components/Reports/income-reports/income-reports.component';
import { InventoryReportsComponent } from './components/Reports/inventory-reports/inventory-reports.component';
import { VoidedOrdersComponent } from './components/voided-orders/voided-orders.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from 'src/app/shared/guards/auth/auth.guard';
import { VoidedOrdersReportsComponent } from './components/Reports/voided-orders-reports/voided-orders-reports.component';
import { RegisterCustomerComponent } from './components/customers/register-customer/register-customer.component';
import { CreditSalesReportsComponent } from './components/Reports/credit-sales-reports/credit-sales-reports.component';
import { AddPettyCashComponent } from './components/PettyCash/add-petty-cash/add-petty-cash.component';
import { DisplayInventoryComponent } from './components/display-inventory/display-inventory.component';
import { AddTakeOutOrgirnizationComponent } from './components/TakeOuteSale/add-take-out-orgirnization/add-take-out-orgirnization.component';
import { TakeOuteSaleComponent } from './components/TakeOuteSale/take-oute-sale/take-oute-sale.component';
import { ShowTakeOutSalesComponent } from './components/TakeOuteSale/show-take-out-sales/show-take-out-sales.component';
import { RecipeComponent } from './components/Recipe/recipe/recipe.component';
import { IncredientsComponent } from './components/Recipe/incredients/incredients.component';
import { RoomsComponent } from './components/Rooms/rooms/rooms.component';
import { SuppliersComponent } from './components/suprplies/suppliers/suppliers.component';
import { PurchasesComponent } from './components/suprplies/purchases/purchases.component';
import { TranferStockFromStorStoreeComponent } from './components/inventory/tranfer-stock-from-stor-storee/tranfer-stock-from-stor-storee.component';
import { StockTransferReportsComponent } from './components/Reports/stock-transfer-reports/stock-transfer-reports.component';
import { DisplayCustomersComponent } from './components/customers/display-customers/display-customers.component';
import { ShowAllIncredientsComponent } from './components/Recipe/show-all-incredients/show-all-incredients.component';
import { ShowAllRecipeComponent } from './components/Recipe/show-all-recipe/show-all-recipe.component';
import { RequestAllIncredientsForReceipeComponent } from './components/Recipe/request-all-incredients-for-receipe/request-all-incredients-for-receipe.component';
import { ShowRecepeRequestComponent } from './components/Recipe/show-recepe-request/show-recepe-request.component';
import { StoreCategoriesComponent } from './components/store/dtoreCategories/store-categories/store-categories.component';
import { StoreProductComponent } from './components/store/dtoreProduct/store-product/store-product.component';
import { StoreRequisitionFormComponent } from './components/store/dtoreRequisitions/store-requisition-form/store-requisition-form.component';
import { StoreRequisitionsComponent } from './components/store/dtoreRequisitions/store-requisitions/store-requisitions.component';
import { StorePurchasesComponent } from './components/store/dtorePurchases/store-purchases/store-purchases.component';
import { StorePurchaseFormComponent } from './components/store/dtorePurchases/store-purchase-form/store-purchase-form.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: AdminMainComponent,
  },
  {
    path: 'add-product',
    component: AddProductFormComponent,
  },
  {
    path: 'categories',
    component: DisplayCategoriesComponent,
  },
  {
    path: 'products',
    component: DisplayProductsComponent,
  },
  {
    path: 'add-category',
    component: AddCategoryComponent,
  },
  {
    path: 'edit-category',
    component: EditCategoryComponent,
  },
  {
    path: 'reservation',
    component: DisplayReservationsComponent,
  },
  {
    path: 'shifts',
    component: ShiftsComponent,
    canActivate: [AuthGuard], // You can add AuthGuard for security
    // data: {
    //   allowedRoles: ['WAITER']
    // }
  },
  {
    path: 'add_petty_cash',
    component: AddPettyCashComponent,
    canActivate: [AuthGuard], // You can add AuthGuard for security
    data: {
      allowedRoles: ['WAITER'], // This route is accessible to Waiters
    },
  },
  {
    path: 'tables',
    component: TablesComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ['WAITER'], // This route is accessible to Waiters
    },
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ['WAITER'], // This route is accessible to Waiters
    },
  },
  {
    path: 'display-inventory',
    component: DisplayInventoryComponent,
    canActivate: [AuthGuard],
    data: {
      allowedRoles: ['WAITER'], // This route is accessible to Waiters
    },
  },
  {
    path: 'users',
    component: AdminTableComponent,
  },
  {
    path: 'edit-product',
    component: EditProductsComponent,
  },
  {
    path: 'edit-category',
    component: EditCategoryComponent,
  },
  {
    path: 'edit-users',
    component: EditUsersComponent,
  },
  {
    path: 'sales-report',
    component: SalesReportsComponent,
  },
  {
    path: 'income-report',
    component: IncomeReportsComponent,
  },
  {
    path: 'inventory-report',
    component: InventoryReportsComponent,
  },
  {
    path: 'voided-orders',
    component: VoidedOrdersComponent,
  },
  {
    path: 'Credit_sales_report',
    component: CreditSalesReportsComponent,
  },
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
  },
  {
    path: 'voidedOrders-Reports',
    component: VoidedOrdersReportsComponent,
  },
  {
    path: 'register_customers',
    component: RegisterCustomerComponent,
  },
  {
    path: 'take_out_org',
    component: AddTakeOutOrgirnizationComponent,
  },
  {
    path: 'makeTakeOutSales',
    component: TakeOuteSaleComponent,
  },
  {
    path: 'takeOutSales',
    component: ShowTakeOutSalesComponent,
  },
  {
    path: 'Recipe',
    component: ShowAllRecipeComponent,
  },
  {
    path: 'add-recipe',
    component: RecipeComponent,
  },
  {
    path: 'add-ingredients',
    component: IncredientsComponent,
  },
  {
    path: 'add-ingredients-request',
    component: RequestAllIncredientsForReceipeComponent,
  },
  {
    path: 'ingredients-request',
    component: ShowRecepeRequestComponent,
  },
  {
    path: 'ingredients',
    component: ShowAllIncredientsComponent,
  },
  {
    path: 'Rooms',
    component: RoomsComponent,
  },
  {
    path: 'suppliers',
    component: SuppliersComponent,
  },
  {
    path: 'purchase',
    component: PurchasesComponent,
  },
  {
    path: 'stock_transfer',
    component: TranferStockFromStorStoreeComponent,
  },
  {
    path: 'stock_transfer_report',
    component: StockTransferReportsComponent,
  },
  {
    path: 'customers',
    component: DisplayCustomersComponent,
  },
  {
    path: 'store-categories',
    component: StoreCategoriesComponent,
  },
  // {
  //   path: 'store-products',
  //   component: StoreProductComponent,
  // },
  {
    path: 'store-products',
    component: StoreProductComponent,
  },
  {
    path: 'requistion-form',
    component: StoreRequisitionFormComponent,
  },
  {
    path: 'requistion',
    component: StoreRequisitionsComponent,
  },
  {
    path: 'store-purchases',
    component: StorePurchasesComponent,
  },
  // {
  //   path: 'purchase-form',
  //   component: StoreRequisitionsComponent,
  // },
  // {
  //   path: '',
  //   redirectTo: 'register-users',
  //   pathMatch: 'full',
  // },
  // {
  //   path: 'register-users',
  //   component: RegisterUsersComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
