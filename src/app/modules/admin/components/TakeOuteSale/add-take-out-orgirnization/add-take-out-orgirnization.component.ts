import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-add-take-out-orgirnization',
  templateUrl: './add-take-out-orgirnization.component.html',
  styleUrls: ['./add-take-out-orgirnization.component.scss'],
})
export class AddTakeOutOrgirnizationComponent implements OnInit {
  organization = {
    name: '',
    status: true, // Assuming 1 represents 'Active' and 0 represents 'Inactive'
  };
  award = {
    type: '',
    pax: null,
    cost: null,
    org: null,
  };

  isOpen: boolean = false;
  isOpenAward: boolean = false;
  tackOutOrganization: any[] = [];

  constructor(
    private adminservice: AdminService,
    private toast: HotToastService
  ) {}
  ngOnInit(): void {
    this.getAllOrgs();
  }
  openModal() {
    this.isOpen = true;
    this.isOpenAward = false;
  }
  closeModal() {
    this.isOpen = false;
  }
  openModalAward() {
    this.isOpen = false;
    this.isOpenAward = true;
  }
  closeModalAward() {
    this.isOpenAward = false;
  }

  submitForm() {
    console.log('Form submitted:', this.organization);
    const org = {
      name: this.organization.name,
      status: this.organization.status,
    };
    this.adminservice.createTakeOutOrg(org).subscribe((data: any) => {
      // console.log("Orginazition created successfully",data);
      this.clearForm();
      this.toast.success('Organization added successfully');
      this.getAllOrgs();
    });
  }

  submitFormAward() {
    const award = {
      take_out_organization_id: this.award.org,
      type: this.award.type,
      pax: this.award.pax,
      cost_per_person: this.award.cost,
    };
    // console.log('Form submitted:', award);

    this.adminservice.createTakeOutOrgAwards(award).subscribe((data: any) => {
      // console.log("Orginazition created successfully",data);
      this.clearForm();
      this.toast.success('Award added successfully');
    });
  }
  getAllOrgs() {
    this.adminservice.getAllTakeOutOrg().subscribe((data: any) => {
      console.log('All Orginazitions', data);
      this.tackOutOrganization = data;
      this.tackOutOrganization = Object.values(data.organizations);
    });
  }
  clearForm() {
    this.organization = {
      name: '',
      status: true,
    };
    this.award = {
      type: '',
      pax: null,
      cost: null,
      org: null,
    };
  }
  // onCustomerSelectionChange() {
  //   console.log('Selected Customer ID:', this.selectedCustomer);
  //   if (this.selectedCustomer !== null) {
  //     const customerId = this.selectedCustomer;
  //     this.adminService.getCustomerById(customerId).subscribe(customers => {
  //       this.selectedCustomerDetails = customers;
  //       console.log("Selected customer",this.selectedCustomerDetails);
  //     });    }
  // }
}
