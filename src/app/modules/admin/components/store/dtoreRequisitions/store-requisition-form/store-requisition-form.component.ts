import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { RequisitionService } from 'src/app/modules/admin/services/Requisition/requisition.service';
import { RequisitionInterface, RequisitionItem } from 'src/app/shared/interfaces/requisition.interface';
import { StoreProductsService } from 'src/app/modules/admin/services/store-products.service';
import { storeProduct } from 'src/app/shared/interfaces/storeProduct.interface';

@Component({
  selector: 'app-store-requisition-form',
  templateUrl: './store-requisition-form.component.html',
  styleUrls: ['./store-requisition-form.component.scss']
})
export class StoreRequisitionFormComponent extends ModalComponent implements OnInit  {
  @Input() requisitionId: string = '';
  requisitionForm: FormGroup;
  isUpdateMode: boolean = false;

  productSearchTerm: string = '';
  filteredProducts: storeProduct[] = [];
  selectedProducts: {
    product: storeProduct;
    quantity: number;
  }[] = [];

  departments: string[] = [
    'Kitchen',
    'Bakery',
    'House-Keeping',
    'Shop',
    'Catic',
  ];

  constructor(
    private fb: FormBuilder,
    private requisitionService: RequisitionService,
    private storeProductsService: StoreProductsService
  ) {
    super();
    this.requisitionId = this.dialogRemoteControl.payload;
    if (this.requisitionId) {
      this.isUpdateMode = true;
      this.loadRequisitionDetails(this.requisitionId);
    } else {
      this.isUpdateMode = false;
    }

    this.requisitionForm = this.fb.group({
      department: ['', Validators.required],
      date: ['', Validators.required],
      requestedBy: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.requisitionId) {
      this.isUpdateMode = true;
      this.loadRequisitionDetails(this.requisitionId);
    }
  }

  loadRequisitionDetails(id: string): void {
    this.requisitionService.getRequisitionbyId(this.requisitionId).subscribe(
      (requisition: RequisitionInterface) => {
        this.requisitionForm.patchValue({
          department: requisition.department,
          date: new Date(requisition.date),
          requestedBy: requisition.requestedBy,
        });
        this.selectedProducts = requisition.item.map((item) => ({
          product: this.findProductById(item.productId),
          quantity: item.quantity,
        }));
      },
      (error) => console.error('Error loading requisition details:', error)
    );
  }

  findProductById(productId: string): storeProduct {
    return {
      id: productId,
      name: 'Product Name',
      quantity: 0,
      price: 0,
      // ... other properties
    } as storeProduct;
  }

  searchProducts(): void {
    if (this.productSearchTerm.trim() !== '') {
      this.storeProductsService.getAllStoreProducts().subscribe((products) => {
        this.filteredProducts = products.filter((product) =>
          product.name
            .toLowerCase()
            .includes(this.productSearchTerm.toLowerCase())
        );
      });
    }
  }

  addProductToRequisition(product: storeProduct): void {
    if (product.quantity <= 0) {
      this.toast.error(`Product ${product.name} is out of stock`);
      return;
    }

    if (product.quantity < 5) {
      this.toast.warning(`Product ${product.name} is almost depleted`);
    }

    const existingProduct = this.selectedProducts.find(p => p.product.id === product.id);
    
    if (existingProduct) {
      const newQuantity = existingProduct.quantity + 1;
      if (newQuantity > product.quantity) {
        this.toast.error(`Cannot add more. Only ${product.quantity} ${product.name}(s) available.`);
        return;
      }
      existingProduct.quantity = newQuantity;
    } else {
      this.selectedProducts.push({ product, quantity: 1 });
    }

    this.filteredProducts = [];
    this.productSearchTerm = '';
  }

  updateQuantity(product: storeProduct, quantity: number): void {
    const item = this.selectedProducts.find((p) => p.product.id === product.id);
    if (item) {
      if (quantity > product.quantity) {
        this.toast.error(`Cannot update. Only ${product.quantity} ${product.name}(s) available.`);
        item.quantity = product.quantity; 
      } else {
        item.quantity = quantity;
      }
    }
  }

  removeProductFromRequisition(product: storeProduct): void {
    this.selectedProducts = this.selectedProducts.filter(
      (p) => p.product.id !== product.id
    );
  }

  mapToRequisitionItem(): RequisitionItem[] {
    return this.selectedProducts.map((p) => ({
      productId: p.product.id,
      quantity: p.quantity,
    }));
  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.username;
  }

  submitRequisition(): void {
    if (this.requisitionForm.invalid || this.selectedProducts.length === 0) {
      alert('Please fill all required fields and select at least one product.');
      return;
    }

    const requisition: RequisitionInterface = {
      id: this.isUpdateMode ? this.requisitionId : '',
      department: this.requisitionForm.value.department,
      date: this.requisitionForm.value.date,
      requestedBy: this.requisitionForm.value.requestedBy,
      item: this.mapToRequisitionItem(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
    };

    if (this.isUpdateMode) {
      this.updateRequisition(requisition);
    } else {
      this.addRequisition(requisition);
    }
  }

  addRequisition(requisition: RequisitionInterface): void {
    this.requisitionService.addRequisition(requisition).subscribe(
      (response) => {
        console.log('Requisition added:', response);
        this.toast.success('Requisition added successfully');
        // alert('Requisition added successfully');
        this.close();
      },
      (error) => {
        console.error('Error adding requisition:', error);
        this.toast.error('Error adding requisition: ');
        // alert('Error adding requisition: ');
      }
    );
  }

  updateRequisition(requisition: RequisitionInterface): void {
    this.requisitionService
      .updateRequisition(this.requisitionId, requisition)
      .subscribe(
        (response) => {
          console.log('Requisition updated:', response);
          this.toast.success('Requisition updated successfully');
          // alert('Requisition updated successfully');
          this.approveRequisition(this.requisitionId);
          this.close();
        },
        (error) => {
          console.error('Error updating requisition:', error);
          this.toast.error('Error updating requisition');
          // alert('Error updating requisition: ' + error.message);
        }
      );
  }

  approveRequisition(id: string): void {
    const approvedBy = {
      approvedBy: this.getCurrentUser(),
    };
    this.requisitionService
      .approveRequisition(id, approvedBy)
      .subscribe((data) => {
        console.log('Requisition approved:', data);
        this.toast.success('Requisition approved successfully');
        // alert('Requisition approved successfully');
      });
  }

}
