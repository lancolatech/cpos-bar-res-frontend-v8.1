import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShiftService } from '../../../services/shift.service';

@Component({
  selector: 'app-show-recepe-request',
  templateUrl: './show-recepe-request.component.html',
  styleUrls: ['./show-recepe-request.component.scss'],
})
export class ShowRecepeRequestComponent {
  requestForm!: FormGroup;
  productionForm!: FormGroup;
  ingredients: any[] = [];
  incredientsRequest: any;
  pendingRequest: any[] = [];
  completedRequest: any[] = [];
  currentRequest: any = null;
  addProducts: boolean = false;
  currentShift: any;
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder,
    private shiftService: ShiftService
  ) {
    this.initForms();
  }
  ngOnInit() {
    this.getAllIngredients();
    this.currentShiftId();
  }
  initForms() {
    this.requestForm = this.fb.group({
      recipeId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });

    this.productionForm = this.fb.group({
      producedQuantity: ['', [Validators.required, Validators.min(0)]],
    });
  }
  getAllIncredientsRequest(status: string) {
    this.adminService.getAllIncredientsRequests().subscribe((data) => {
      this.pendingRequest = data.penddingRequests;
      this.completedRequest = data.completeRequests;
      if (status === 'pending') {
        this.incredientsRequest = this.pendingRequest;
      }
      if (status === 'complete') {
        this.incredientsRequest = this.completedRequest;
      }
    });
  }
  getAllIncredientsRequestForAShift(shiftId: string) {
    this.adminService
      .getAllIncredientsRequestsForAShift(shiftId)
      .subscribe((data) => {
        this.incredientsRequest = data;
        console.log('all incredieents request', this.incredientsRequest);
      });
  }
  getAllIngredients() {
    this.adminService.getIngredient().subscribe((data: any) => {
      this.ingredients = data;
      console.log('all incredieents', this.ingredients);
    });
  }
  getIngredientNameById(id: string): string {
    const ingredient = this.ingredients.find((incredient) => {
      return incredient.id === id;
    });
    if (ingredient) {
      return ingredient.name;
    }
    return 'loading...';
  }
  currentShiftId() {
    this.shiftService.currentShift$.subscribe((shift) => {
      this.currentShift = shift;
      this.getAllIncredientsRequestForAShift(this.currentShift.id);
    });
  }
  onProductionSubmit() {
    this.addProducts = true;
    if (this.productionForm.valid && this.currentRequest) {
      const { producedQuantity } = this.productionForm.value;
      this.adminService
        .recordProduction(
          this.currentRequest.id,
          producedQuantity,
          this.currentShift.id
        )
        .subscribe(
          (response: any) => {
            console.log('Production recorded:', response);
            this.currentRequest = null;
            this.productionForm.reset();
            this.addProducts = false;
          },
          (error) => console.error('Error recording production:', error)
        );
    }
  }
  openAddProductsModal(request: any) {
    this.currentRequest = request;
    this.addProducts = true;
  }
  closeAddProductsModal() {
    this.addProducts = false;
  }
}
