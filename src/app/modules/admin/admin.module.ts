import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminMainComponent } from './components/admin-main/admin-main.component';
import { LoginComponent } from './login/login.component';
import { RegisterUsersComponent } from './components/register-users/register-users.component';
import { AddProductFormComponent } from './components/add-product-form/add-product-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddProductButtonComponent } from './components/add-product-button/add-product-button.component';
import { AdminTableComponent } from './components/admin-table/admin-table.component';
import { DisplayCategoriesComponent } from './components/display-categories/display-categories.component';
import { DisplayProductsComponent } from './components/display-products/display-products.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { DisplayReservationsComponent } from './components/display-reservations/display-reservations.component';
import { ShiftsComponent } from './components/shifts/shifts.component';
import { TablesComponent } from './components/tables/tables.component';
import { EditCategoryComponent } from './components/edit-category/edit-category.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { EditProductsComponent } from './components/edit-products/edit-products.component';
import { EditUsersComponent } from './components/edit-users/edit-users.component';
import { SalesReportsComponent } from './components/Reports/sales-reports/sales-reports.component';
import { IncomeReportsComponent } from './components/Reports/income-reports/income-reports.component';
import { InventoryReportsComponent } from './components/Reports/inventory-reports/inventory-reports.component';
import { VoidedOrdersComponent } from './components/voided-orders/voided-orders.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { VoidedOrdersReportsComponent } from './components/Reports/voided-orders-reports/voided-orders-reports.component';
import { CurrencyFormatPipe } from 'src/app/layouts/main-layout/Data/currency-format.pipe';
import { RegisterCustomerComponent } from './components/customers/register-customer/register-customer.component';
import { DisplayCustomersComponent } from './components/customers/display-customers/display-customers.component';
import { EditCustomersComponent } from './components/customers/edit-customers/edit-customers.component';
import { CreditSalesReportsComponent } from './components/Reports/credit-sales-reports/credit-sales-reports.component';
import { AddPettyCashComponent } from './components/PettyCash/add-petty-cash/add-petty-cash.component';
import { DisplayInventoryComponent } from './components/display-inventory/display-inventory.component';
import { TakeOuteSaleComponent } from './components/TakeOuteSale/take-oute-sale/take-oute-sale.component';
import { AddTakeOutOrgirnizationComponent } from './components/TakeOuteSale/add-take-out-orgirnization/add-take-out-orgirnization.component';
import { ShowTakeOutSalesComponent } from './components/TakeOuteSale/show-take-out-sales/show-take-out-sales.component';
import { RecipeComponent } from './components/Recipe/recipe/recipe.component';
import { IncredientsComponent } from './components/Recipe/incredients/incredients.component';
import { RoomsComponent } from './components/Rooms/rooms/rooms.component';
import { SuppliersComponent } from './components/suprplies/suppliers/suppliers.component';
import { PurchasesComponent } from './components/suprplies/purchases/purchases.component';
import { TransferStockComponent } from './components/suprplies/transfer-stock/transfer-stock.component';
import { TranferStockFromStorStoreeComponent } from './components/inventory/tranfer-stock-from-stor-storee/tranfer-stock-from-stor-storee.component';
import { StockTransferReportsComponent } from './components/Reports/stock-transfer-reports/stock-transfer-reports.component';
import { PreLoaderComponent } from 'src/app/shared/pre-loader/pre-loader.component';
import { ShowAllIncredientsComponent } from './components/Recipe/show-all-incredients/show-all-incredients.component';
import { RequestAllIncredientsForReceipeComponent } from './components/Recipe/request-all-incredients-for-receipe/request-all-incredients-for-receipe.component';
import { ShowAllRecipeComponent } from './components/Recipe/show-all-recipe/show-all-recipe.component';
import { ShowRecepeRequestComponent } from './components/Recipe/show-recepe-request/show-recepe-request.component';
import { ButtonLoaderComponent } from 'src/app/shared/components/button-loader/button-loader.component';
import { RecipeIngridientsReportsComponent } from './components/Reports/recipe-ingridients-reports/recipe-ingridients-reports.component';
import { StoreProductComponent } from './components/store/dtoreProduct/store-product/store-product.component';
import { StoreCategoriesComponent } from './components/store/dtoreCategories/store-categories/store-categories.component';
import { StorePurchasesComponent } from './components/store/dtorePurchases/store-purchases/store-purchases.component';
import { StoreRequisitionsComponent } from './components/store/dtoreRequisitions/store-requisitions/store-requisitions.component';
import { StoreCategoryFormComponent } from './components/store/dtoreCategories/store-category-form/store-category-form.component';
import { StorePurchaseFormComponent } from './components/store/dtorePurchases/store-purchase-form/store-purchase-form.component';
import { StoreProductsFormComponent } from './components/store/dtoreProduct/store-products-form/store-products-form.component';
import { StoreRequisitionFormComponent } from './components/store/dtoreRequisitions/store-requisition-form/store-requisition-form.component';
import { LoaderComponent } from 'src/app/shared/components/loader/loader.component';

@NgModule({
  declarations: [
    AdminMainComponent,
    LoginComponent,
    RegisterUsersComponent,
    AddProductFormComponent,
    AddProductButtonComponent,
    AdminTableComponent,
    CurrencyFormatPipe,

    DisplayCategoriesComponent,
    DisplayProductsComponent,
    AddCategoryComponent,
    DisplayReservationsComponent,
    ShiftsComponent,
    TablesComponent,
    EditCategoryComponent,
    InventoryComponent,
    EditProductsComponent,
    EditUsersComponent,
    SalesReportsComponent,
    IncomeReportsComponent,
    InventoryReportsComponent,
    VoidedOrdersComponent,
    AdminDashboardComponent,
    VoidedOrdersReportsComponent,
    // RegisterCustomerComponent,
    DisplayCustomersComponent,
    EditCustomersComponent,
    CreditSalesReportsComponent,
    AddPettyCashComponent,
    DisplayInventoryComponent,
    TakeOuteSaleComponent,
    AddTakeOutOrgirnizationComponent,
    ShowTakeOutSalesComponent,
    RecipeComponent,
    IncredientsComponent,
    RoomsComponent,
    SuppliersComponent,
    PurchasesComponent,
    TransferStockComponent,
    TranferStockFromStorStoreeComponent,
    StockTransferReportsComponent,
    ShowAllIncredientsComponent,
    RequestAllIncredientsForReceipeComponent,
    ShowAllRecipeComponent,
    ShowRecepeRequestComponent,
    RecipeIngridientsReportsComponent,
    StoreProductComponent,
    StoreCategoriesComponent,
    StorePurchasesComponent,
    StoreRequisitionsComponent,
    StoreCategoryFormComponent,
    StorePurchaseFormComponent,
    StoreProductsFormComponent,
    StoreRequisitionFormComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PreLoaderComponent,
    RegisterCustomerComponent,
    ButtonLoaderComponent,
    LoaderComponent,
  ],
})
export class AdminModule {}
