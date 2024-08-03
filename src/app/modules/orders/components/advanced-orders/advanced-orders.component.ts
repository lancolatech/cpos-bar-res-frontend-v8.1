import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrderCommunicationService } from '../../services/order-communication.service';
import { Router } from '@angular/router';
import { OrganizationInterface } from 'src/app/shared/interfaces/organization.interface';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';

@Component({
  selector: 'app-advanced-orders',
  templateUrl: './advanced-orders.component.html',
  styleUrls: ['./advanced-orders.component.scss'],
})
export class AdvancedOrdersComponent {
  // Inject HttpClient in the constructor
  apiUrl: string = '';
  savedOrg: OrganizationInterface | null = null;
  constructor(
    private http: HttpClient,
    private orderCommunicationService: OrderCommunicationService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
    this.fetchOrganizationInfo();
  }

  private fetchOrganizationInfo() {
    const companyInfoString = this.localStorageService.getItem('companyInfo');
    this.savedOrg = companyInfoString ? JSON.parse(companyInfoString) : null;
    // console.log('company Infor', this.savedOrg);

    if (!this.savedOrg || !this.savedOrg.id) {
      console.error('companyInfo is invalid or does not have an id property');
      return;
    }

    this.apiUrl = `${environment.apiRootUrl}/organizations/${this.savedOrg.id}`;
    // console.log('api url link', this.apiUrl);
  }

  // Function to handle form submission
  onSubmit() {
    const currentDateTime = new Date().toISOString();
    const formattedOrderedDate = currentDateTime
      .toString()
      .slice(0, 19)
      .replace('T', ' ');

    // Get form data
    const formData = {
      ordered_date: formattedOrderedDate,
      pickup_date_time: (
        document.getElementById('pickupDateTime') as HTMLInputElement
      ).value,
      waiters_name: (document.getElementById('waitersName') as HTMLInputElement)
        .value,
      full_name: (document.getElementById('fullName') as HTMLInputElement)
        .value,
      phone_number: (document.getElementById('phoneNumber') as HTMLInputElement)
        .value,
      nationalId: (document.getElementById('nationalId') as HTMLInputElement)
        .value,
      orderRemarks: (
        document.getElementById('orderRemarks') as HTMLInputElement
      ).value,
      shift_id: '1',
    };

    // Make an HTTP POST request to your Laravel backend
    this.http.post(`${this.apiUrl}/advance-orders`, formData).subscribe(
      (response: any) => {
        console.log('Post Request Successful', response);
        // Optionally, you can handle the response or redirect the user to another page

        // Send the order ID to the main menu component
        this.orderCommunicationService.updateOrderId(response.id);
        console.log('Order ID sent to main menu component', response.id);
        this.router.navigate(['/menu/main-page', response.id]);
      },
      (error) => {
        console.error('Post Request Failed', error);
        // Optionally, you can handle the error or display an error message to the user
      }
    );
  }
}
