import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { data } from 'jquery';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {
  query: string = '';
  name: string = '';
  phone: string = '';
  till_number: string = '';
  paybil_acc: string = '';
  mpesa_number: string = '';


  suppliers: any[] = [];
  openAddModal: boolean = false;
  openEditModal: boolean = false;
  idToUpdate:any;
  selectedSurplier:any;



  constructor( 
    private adminService: AdminService,
    private toast: HotToastService,
  ) { }
  ngOnInit(): void {
    this.getAllSuppliers();
  }

  createSuppliers(){
    const data ={
      name: this.name,
      phone: this.phone,
      till_number: this.till_number,
      paybill_account: this.paybil_acc,
      mpesa_number: this.mpesa_number,
      
    }
    console.log( ' sent data',data);
    this.adminService.createSuppliers(data).subscribe((data: any) => {
      this.toast.success('Supplier Created Successfully');
      this.clearForm();
    });
  }
  clearForm(){
    this.name = '';
    this.phone = '';
    this.till_number = '';
    this.paybil_acc = '';
    this.mpesa_number = '';
  }

  getAllSuppliers(){
    this.adminService.getSuppliers().subscribe((data: any) => {
      this.suppliers = data;
      console.log(this.suppliers);
    });
  }
  loadData(id: any) {
    this.selectedSurplier=this.suppliers.find(x => x.id === id);
  this.name = this.selectedSurplier.name;
  this.phone = this.selectedSurplier.phone;
  this.till_number = this.selectedSurplier.till_number;
  this.paybil_acc = this.selectedSurplier.paybill_account;
  this.mpesa_number = this.selectedSurplier.mpesa_number;
  this.idToUpdate = this.selectedSurplier.id;
  }
  updateSuplier(){
    const id = this.idToUpdate;
    const data ={
      name: this.name,
      phone: this.phone,
      till_number: this.till_number,
      paybill_account: this.paybil_acc,
      mpesa_number: this.mpesa_number,
    }
    this.adminService.updateSuppliers(id,data).subscribe((data: any) => {
      this.toast.success('Supplier Updated Successfully');
      this.clearForm();
      this.getAllSuppliers();
      this.closeEditModalHandler();
    });
  }
  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this Supplier?')) {
      this.adminService.deleteSurplier(id).subscribe(
        (response: any) => {
        this.toast.success('Supplier Deleted Successfully');
        this.getAllSuppliers();
        },
        (error: any) => {
          // Handle error
          this.toast.error('Error deleting Supplier:');
          console.error('Error deleting category:', error);
        }
      );
    }
  }
  openAddModalHandler(){
    this.openAddModal = true;
  }
  closeAddModalHandler(){
    this.openAddModal = false;
  }
  openEditModalHandler(id: number){
    this.openEditModal = true;
    this.loadData(id);
  }
  closeEditModalHandler(){
    this.openEditModal = false;
  }

}
