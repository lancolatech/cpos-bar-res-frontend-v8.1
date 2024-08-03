import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';
import { HotToastService } from '@ngneat/hot-toast';
import { ShiftService } from '../../../services/shift.service';

@Component({
  selector: 'app-request-all-incredients-for-receipe',
  templateUrl: './request-all-incredients-for-receipe.component.html',
  styleUrls: ['./request-all-incredients-for-receipe.component.scss'],
})
export class RequestAllIncredientsForReceipeComponent implements OnInit {
  recipes: any[] = [];
  requestForm!: FormGroup;
  productionForm!: FormGroup;
  currentRequest: any = null;
  incredients: any[] = [];
  buttonLoading: boolean = false;
  currentShift: any = null;

  constructor(
    private fb: FormBuilder,
    private recipeService: AdminService,
    private toast: HotToastService,
    private shiftService: ShiftService
  ) {}

  ngOnInit() {
    this.loadRecipes();
    this.initForms();
    this.getAllIncredients();
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

  loadRecipes() {
    this.recipeService.getAllRecipe().subscribe(
      (data: any) => {
        this.recipes = data;
      },
      (error) => console.error('Error loading recipes:', error)
    );
  }
  getAllIncredients() {
    this.recipeService.getIngredient().subscribe((data: any) => {
      this.incredients = data;
      console.log('incredients', this.incredients);
    });
  }
  currentShiftId() {
    this.shiftService.currentShift$.subscribe((shift) => {
      this.currentShift = shift;
      console.log('current shift', this.currentShift);
    });
  }

  onRequestSubmit() {
    if (this.requestForm.valid) {
      const { recipeId, quantity } = this.requestForm.value;
      this.buttonLoading = true;

      // First, check ingredient availability
      this.recipeService
        .checkIngredientAvailability(recipeId, quantity)
        .subscribe(
          (response: any) => {
            if (response.available) {
              // If ingredients are available, proceed with the request
              this.createIngredientRequest(recipeId, quantity);
            } else {
              // If ingredients are not available, show a notification
              const insufficientIngredients =
                response.insufficientIngredients.join(', ');
              this.toast.error(
                `Insufficient quantities for: ${insufficientIngredients}`
              );
              this.buttonLoading = false;
            }
          },
          (error) => {
            console.error('Error checking ingredient availability:', error);
            this.toast.error('Error checking ingredient availability');
            this.buttonLoading = false;
          }
        );
    }
  }

  private createIngredientRequest(recipeId: string, quantity: number) {
    this.recipeService
      .requestIngredients(recipeId, quantity, this.currentShift.id)
      .subscribe(
        (response: any) => {
          this.currentRequest = response;
          console.log('Ingredient request created:', response);
          this.toast.success('Ingredient request created successfully');
          this.buttonLoading = false;
        },
        (error) => {
          console.error('Error creating ingredient request:', error);
          this.toast.error('Error creating ingredient request');
          this.buttonLoading = false;
        }
      );
  }

  onProductionSubmit() {
    if (this.productionForm.valid && this.currentRequest) {
      const { producedQuantity } = this.productionForm.value;
      this.recipeService
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
          },
          (error) => console.error('Error recording production:', error)
        );
    }
  }
}
