import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { ShiftService } from 'src/app/modules/admin/services/shift.service';
import { UserService } from 'src/app/shared/services/user/user.service';
import { UserInterface } from 'src/app/shared/interfaces/auth.interface';
import { OrdersService } from 'src/app/modules/orders/services/orders.service';
import { AdminService } from '../../services/admin.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-voided-orders',
  templateUrl: './voided-orders.component.html',
  styleUrls: ['./voided-orders.component.scss'],
})
export class VoidedOrdersComponent implements OnInit {
  currentUser: UserInterface | null = null;
  voidedOrders: any[] = []; // Placeholder for voided orders
  orderIdToUpdate: any;
  private apiUrl = `${environment.apiRootUrl}/categories`;

  constructor(
    private menuService: MenuService,
    private shiftService: ShiftService,
    private userService: UserService,
    private adminService: AdminService,
    private authService: AuthService,
    private toast: HotToastService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
      console.log('Current User:', this.currentUser);

      // Fetch orders and filter for voided ones
      this.fetchVoidedOrders();
    });
  }

  fetchVoidedOrders(): void {
    this.shiftService.currentShift$.subscribe((currentShift) => {
      if (currentShift && this.currentUser) {
        const id = currentShift.id;

        this.menuService.getPostedOrdersDeleted().subscribe((data: any[]) => {
          this.voidedOrders = data
            // .filter((order: any) => order.ShiftID === id)
            .map((order: any) => {
              // Parse the 'Items' string into an array of objects
              order.Items = order.Items || '[]';

              // Log out the items within each order
              // console.log('Items within order:', order.Items);

              return order;
            });

          console.log(
            'Voided orders for the current shift:',
            this.voidedOrders
          );
        });
      }
    });
  }

  updateSelectedVoidedOrderConfirmDelete(): void {
    this.menuService.confirmeleteOrder(this.orderIdToUpdate).subscribe(
      () => {
        // Update successful - handle success scenario here

        this.toast.success('Confirm_delete updated successfully.');
        this.fetchVoidedOrders();
        this.logoutUser();
        // You can perform additional actions upon successful update if needed
      },
      (error) => {
        // Handle error scenario
        this.toast.error('Error updating confirm_delete:', error);
        // You can display an error message or handle the error accordingly
      }
    );
  }

  confirmDelete(orderId: number): void {
    // Update the orderIdToUpdate property with the selected orderId
    this.orderIdToUpdate = orderId;

    // Call the updateSelectedVoidedOrderConfirmDelete method when confirming deletion
    this.updateSelectedVoidedOrderConfirmDelete();
  }

  addBackProductQuantity(items: any[]): void {
    const selectedItemsMap = new Map<number, number>(); // Map to hold productId and selectedItems

    // Collect selectedItems for each product ID
    items.forEach((item: any) => {
      const productId = item.id;
      const selectedItems = Number(item.selectedItems);

      if (!isNaN(selectedItems)) {
        const currentSelectedItems = selectedItemsMap.get(productId) || 0;
        selectedItemsMap.set(productId, currentSelectedItems + selectedItems);
      } else {
        console.error(`Invalid selectedItems for item with ID: ${item.id}`);
      }
    });

    // Fetch all categories and products
    this.menuService.getAllProducts().subscribe((data: any) => {
      if (Array.isArray(data.products)) {
        const products = data.products;

        // Find and update the product quantity for each product matching the selected items

        // Inside the products.forEach loop
        products.forEach((product: any) => {
          const productId = product.id;
          const updatedQuantity = selectedItemsMap.get(productId);

          if (updatedQuantity) {
            // Check if the product is a service before updating
            if (!product.is_service) {
              // Replace this logic with your actual updateProduct method
              this.updateProduct(productId, {
                product_quantity: product.product_quantity + updatedQuantity,
              }).subscribe(
                () => {
                  // console.log(`Product ${productId} quantity updated to ${product.product_quantity + updatedQuantity}`);
                  // Perform any additional logic upon successful update if needed
                },
                (error) => {
                  console.error(
                    `Error updating product ${productId} quantity:`,
                    error
                  );
                  // Handle error scenario
                }
              );
            } else {
              console.log(
                `Product ${productId} is not a service, skipping update.`
              );
              // You can add additional logic here if needed
            }
          }
        });
      }
    });
  }

  updateProduct(productId: string, productData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    return this.menuService.updateProduct(productId, productData).pipe(
      catchError((error: any) => {
        // Handle error (log, display message, etc.)
        return throwError(error);
      })
    );
  }

  rejectVoiding(orderId: number): void {
    this.menuService.updateOrder(orderId, { deleted: 0 }).subscribe(
      () => {
        console.log(`Order ${orderId} voiding rejected.`);
        // Additional logic upon successful rejection if needed
      },
      (error) => {
        console.error(`Error rejecting voiding for order ${orderId}:`, error);
        // Handle error scenario
      }
    );
  }

  declineVoiding(): void {
    this.menuService.declineDeleteOrder(this.orderIdToUpdate).subscribe(
      () => {
        this.toast.success('decline delition updated successfully.');
        this.fetchVoidedOrders();
        this.logoutUser();
        // You can perform additional actions upon successful update if needed
      },
      (error) => {
        // Handle error scenario
        this.toast.error('Error updating delining deletion:');
        // You can display an error message or handle the error accordingly
      }
    );
  }

  declineDelete(orderId: number): void {
    // Update the orderIdToUpdate property with the selected orderId
    this.orderIdToUpdate = orderId;

    // Call the updateSelectedVoidedOrderConfirmDelete method when confirming deletion
    this.declineVoiding();
  }
  logoutUser(): void {
    this.authService.logout();
  }
}
