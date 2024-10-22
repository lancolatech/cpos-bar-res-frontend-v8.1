import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StoreCategoriesService } from 'src/app/modules/admin/services/store-categories.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { storeCategory } from 'src/app/shared/interfaces/storecategory.interface';

@Component({
  selector: 'app-store-category-form',
  templateUrl: './store-category-form.component.html',
  styleUrls: ['./store-category-form.component.scss'],
})
export class StoreCategoryFormComponent
  extends ModalComponent
  implements OnInit
{
  @Input() store: string = '';
  categoryForm: FormGroup;
  isUpdateMode: boolean = false;
  parentCategories: storeCategory[] = [];

  constructor(
    private fb: FormBuilder,
    private storeCategoriesService: StoreCategoriesService
  ) {
    super();
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      createdBy: [this.getCurrentUser(), Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.store) {
      this.isUpdateMode = true;
      this.loadStoreCategoryDetails();
    }
  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.username;
  }

  loadStoreCategoryDetails() {
    this.storeCategoriesService.getStoreCategorybyId(this.store).subscribe(
      (response: storeCategory) => {
        this.categoryForm.patchValue({
          name: response.name,
          description: response.description,
        });
      },
      (error) => {
        console.error('Error getting store category', error);
      }
    );
  }

  onSubmit() {
    console.log('update mede', this.isUpdateMode);
    if (this.categoryForm.valid) {
      if (this.isUpdateMode) {
        this.updateStoreCategory();
      } else {
        this.createStoreCategory();
      }
    }
  }

  createStoreCategory() {
    this.storeCategoriesService
      .addStoreCategory(this.categoryForm.value)
      .subscribe(
        (response: any) => {
          this.close();
        },
        (error) => {
          console.error('Error creating store category', error);
        }
      );
  }

  updateStoreCategory() {
    this.storeCategoriesService
      .updateStoreCategory(this.store, this.categoryForm.value)
      .subscribe(
        (response: any) => {
          this.close();
        },
        (error) => {
          console.error('Error updating store category', error);
        }
      );
  }
}
