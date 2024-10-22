import { Component,  EventEmitter, Output } from '@angular/core';
import { RequisitionService } from 'src/app/modules/admin/services/Requisition/requisition.service';
import { RequisitionInterface, RequisitionItem } from 'src/app/shared/interfaces/requisition.interface';
import { StoreRequisitionFormComponent } from '../store-requisition-form/store-requisition-form.component';
import { StoreProductsService } from 'src/app/modules/admin/services/store-products.service';
import { storeProduct } from 'src/app/shared/interfaces/storeProduct.interface';
import {
  DialogRemoteControl,
  AppearanceAnimation,
  DisappearanceAnimation,
} from '@ng-vibe/dialog';

@Component({
  selector: 'app-store-requisitions',
  templateUrl: './store-requisitions.component.html',
  styleUrls: ['./store-requisitions.component.scss']
})

export class StoreRequisitionsComponent {

  private dialog: DialogRemoteControl = new DialogRemoteControl(
    StoreRequisitionFormComponent
  );
  private updateDialog: DialogRemoteControl = new DialogRemoteControl(
    StoreRequisitionFormComponent
  );

  requisitions: RequisitionInterface[] = [];
  query: string = '';
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  requisitionIdToEdit: string = '';
  requisitionsLoading: boolean = false;
  @Output() editStudent = new EventEmitter<string>();
  products: storeProduct[] = [];

  constructor(
    private requisitionService: RequisitionService,
    private productService: StoreProductsService
  ) {}

  ngOnInit(): void {
    this.getAllRequisitions();
    this.loadProducts();
  }

  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
    this.getAllRequisitions();
  }

  loadProducts() {
    this.productService.getAllStoreProducts().subscribe(
      (products) => (this.products = products),
      (error) => console.error('Error loading products:', error)
    );
  }

  getProductNameById(id: string): string {
    const product = this.products.find((p) => p.id === id);
    if (product) {
      return product.name;
    } else {
      return 'Loading...';
    }
  }

  getAllRequisitions(searchQuery?: string): void {
    this.requisitionsLoading = true;
    this.requisitionService.getAllRequisitions().subscribe(
      (requisitions) => {
        if (searchQuery && searchQuery.trim() !== '') {
          this.requisitions = requisitions.filter((requisition) =>
            requisition.department
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          );
          this.requisitionsLoading = false;
        } else {
          this.requisitions = requisitions;
          this.requisitionsLoading = false;
        }
        console.log('Filtered requisitions', this.requisitions);
      },
      (error) => {
        console.error('Error fetching requisitions', error);
        this.requisitionsLoading = false;
      }
    );
  }

  onInputChange(): void {
    console.log('Query changed', this.query);
    this.getAllRequisitions(this.query);
  }

  deleteRequisition(id: string): void {
    if (confirm('Are you sure you want to delete this requisition?')) {
      this.requisitionService.deleteRequisition(id).subscribe((res) => {
        this.getAllRequisitions(this.query); // Refresh requisitions after deletion
      });
    }
  }

  openDialog(optionalPayload?: any) {
    this.dialog.options = {
      width: '80vw',
      height: 'auto',
      showOverlay: true,
      animationIn: AppearanceAnimation.ZOOM_IN_ROTATE,
      animationOut: DisappearanceAnimation.ZOOM_OUT,
    };
    this.dialog.openDialog(optionalPayload).subscribe((resp) => {
      console.log('Response from dialog content:', resp);
      this.getAllRequisitions(); // Refresh requisitions after addition
    });
  }

  openUpdateDialog(optionalPayload: any) {
    this.updateDialog.options = {
      width: '80vw',
      height: 'auto',
      showOverlay: true,
      animationIn: AppearanceAnimation.ZOOM_IN_ROTATE,
      animationOut: DisappearanceAnimation.ZOOM_OUT,
    };
    this.updateDialog.openDialog(optionalPayload).subscribe((resp) => {
      console.log('Response from dialog content:', resp);
      this.getAllRequisitions(this.query); // Refresh requisitions after update
    });
  }

}
