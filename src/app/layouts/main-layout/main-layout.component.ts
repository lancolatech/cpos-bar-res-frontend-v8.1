import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShiftTagComponent } from './layoutTemplates/shift-tag/shift-tag.component';
import { SearchBarComponent } from './layoutTemplates/search-bar/search-bar.component';
import { NavLinkComponent } from './layoutTemplates/nav-link/nav-link.component';
import { FooterComponent } from './layoutTemplates/footer/footer.component';
import { RightBarComponent } from 'src/app/modules/menu/components/menuTemplates/right-bar/right-bar.component';
import { LogoutComponent } from 'src/app/modules/auth/logout/logout.component';
import { AuthModule } from 'src/app/modules/auth/auth.module';
import { UserService } from 'src/app/shared/services/user/user.service';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { Observable } from 'rxjs';
import { UserInterface } from 'src/app/shared/interfaces/auth.interface';
import { ShiftService } from 'src/app/modules/admin/services/shift.service';
import { navigations } from './Data/navigations'; // Import navigations data here
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { OrgOptionsInterface } from 'src/app/shared/interfaces/organization.interface';
import { upsertItemInArray } from 'src/app/functions/array.function';
import { MenuService } from 'src/app/modules/menu/services/menu.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ShiftTagComponent,
    SearchBarComponent,
    NavLinkComponent,
    FooterComponent,
    RightBarComponent,
    AuthModule,
    LogoutComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  navLinks: any[] = navigations; // Use the imported navigations data
  currentUser: any;
  voidedOrders: any[] = [];
  currentShift: any;
  activeNavLinks: { [key: string]: boolean } = {};
  isMenuOpen: boolean = false;
  orgOptions: OrgOptionsInterface | null = null;

  constructor(
    private authService: AuthService,
    private shiftService: ShiftService,
    private adminService: AdminService,
    private menuService: MenuService
  ) {}

  // Function to toggle the visibility of sublinks for a specific navigation link
  toggleSublinks(navLink: any) {
    if (navLink.sublinks) {
      this.activeNavLinks[navLink.navName] =
        !this.activeNavLinks[navLink.navName];
    }
  }

  isShiftDropdownOpen: boolean = false;
  toggleShiftDropdown() {
    this.isShiftDropdownOpen = !this.isShiftDropdownOpen;
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
    this.checkForOpenShift();
    this.isMenuOpen = window.innerWidth >= 768;
    this.fetchVoidedOrders();
    // Add logic to dynamically show/hide Reception link based on has_reception
    // const orgOptionsString = localStorage.getItem('orgOptions');
    // if (orgOptionsString) {
    //   const orgOptions = JSON.parse(orgOptionsString);
    // if (orgOptions.has_reception) {
    //   // Insert Reception link at index 2
    //   this.navLinks.splice(2, 0, {
    //     navName: 'Reception',
    //     navLink: '/menu/Bookings',
    //   });
    // }
    // if (orgOptions.has_credit_sale) {
    //   // Insert Credit Sales link at index 3
    //   this.navLinks.splice(3, 0, {
    //     navName: 'Credit Sales',
    //     navLink: '/orders/displayCreditSales',
    //   });
    // }
    // if (orgOptions.has_advance_orders) {
    //   // Insert Advance Orders link at index 4
    //   this.navLinks.splice(4, 0, {
    //     navName: 'Advance Orders',
    //     navLink: '/orders/show_advaced_orders',
    //   });
    // }
    // }
  }

  getOrgOptions() {
    this.adminService.orgOptions$.subscribe((orgOptions) => {
      console.log('voided orders ', this.voidedOrders);
      this.orgOptions = orgOptions;
      console.log({ orgOptions });
      if (!orgOptions) {
        this.navLinks = navigations;
        return;
      }

      let navLinks = navigations;
      console.log(this.navLinks.length);

      if (orgOptions.has_reception) {
        console.log('has reception');

        const link = {
          navName: 'Reception',
          navLink: '/menu/Bookings',
          icon: 'fas fa-concierge-bell', // Reception bell icon
        };
        navLinks = upsertItemInArray({
          item: link,
          array: navLinks,
          field: 'navName',
          insertAtIndex: 2,
        });
      }
      if (this.voidedOrders.length > 0) {
        const link = {
          navName: 'Voided Orders ',
          navLink: '/admin/voided-orders',
          orders: this.voidedOrders.length,
          icon: 'fas fa-ban', // Ban/void icon
        };
        navLinks = upsertItemInArray({
          item: link,
          array: navLinks,
          field: 'navName',
          insertAtIndex: 3,
        });
      }
      if (orgOptions.has_credit_sale) {
        const link = {
          navName: 'Credit Sales',
          navLink: '/orders/displayCreditSales',
          icon: 'fas fa-credit-card', // Credit card icon
        };
        navLinks = upsertItemInArray({
          item: link,
          array: navLinks,
          field: 'navName',
          insertAtIndex: 4,
        });
      }
      if (orgOptions.has_advance_orders) {
        const link = {
          navName: 'Advance Orders',
          navLink: '/orders/show_advaced_orders',
          icon: 'fas fa-calendar-plus', // Calendar with plus icon
        };
        navLinks = upsertItemInArray({
          item: link,
          array: navLinks,
          field: 'navName',
          insertAtIndex: 5,
        });
      }
      if (orgOptions.has_takeout) {
        const link = {
          navName: 'Take Out Sales',
          navLink: '/admin/takeOutSales',
          icon: 'fas fa-shopping-bag', // Shopping bag icon
        };
        navLinks = upsertItemInArray({
          item: link,
          array: navLinks,
          field: 'navName',
          insertAtIndex: 6,
        });
      }

      this.navLinks = navLinks;
      console.log(this.navLinks.length);
    });
  }

  checkForOpenShift(): void {
    this.shiftService.currentShift$.subscribe((shift) => {
      if (shift) {
        this.currentShift = shift;
      }
    });
  }

  fetchVoidedOrders(): void {
    this.shiftService.currentShift$.subscribe(
      (currentShift) => {
        if (currentShift && this.currentUser) {
          const id = currentShift.id;

          this.menuService.getPostedOrdersDeleted().subscribe((data: any[]) => {
            this.voidedOrders = data.map((order: any) => {
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
            this.getOrgOptions();
          });
        }
      },
      (error) => {
        this.getOrgOptions();
      }
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isMenuOpen = window.innerWidth >= 768;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
