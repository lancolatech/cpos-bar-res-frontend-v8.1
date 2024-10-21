import { Component, Input } from '@angular/core';
import {
  DialogRemoteControl,
  AppearanceAnimation,
  DisappearanceAnimation,
} from '@ng-vibe/dialog';
import { StoreCategoryFormComponent } from '../store-category-form/store-category-form.component';
import { StoreCategoriesService } from 'src/app/modules/admin/services/store-categories.service';
import { AdminService } from 'src/app/modules/admin/services/admin.service';
import { storeCategory } from 'src/app/shared/interfaces/storecategory.interface';

@Component({
  selector: 'app-store-categories',
  templateUrl: './store-categories.component.html',
  styleUrls: ['./store-categories.component.scss'],
})
export class StoreCategoriesComponent {
  @Input() storeCategoryId: string = '';

  private addDialog: DialogRemoteControl = new DialogRemoteControl(
    StoreCategoryFormComponent
  );

  private updateDialog: DialogRemoteControl = new DialogRemoteControl(
    StoreCategoryFormComponent
  );

  storeCategories: storeCategory[] = [];

  constructor(
    private categoryService: AdminService,
    private storeCategoriesService: StoreCategoriesService
  ) {}

  ngOnInit() {
    this.getAllStoreCategories();
  }

  getAllStoreCategories() {
    this.storeCategoriesService.getAllStoreCategories().subscribe(
      (data: any) => {
        this.storeCategories = data;
        console.log('Store Categories Data:', data);
      },
      (error: any) => {
        console.error('Error getting all store categories:', error);
      }
    );
  }

  deleteStoreCategory(id: string) {
    if (confirm('Are you sure you want to delete this store category?')) {
      this.storeCategoriesService.deleteStoreCategory(id).subscribe(
        (data: any) => {
          console.log('Store Category Deleted:', data);
        },
        (error: any) => {
          console.error('Error deleting store category:', error);
        }
      );
    }
  }

  openDialogAddStoreCategory(optionalPayload?: any) {
    this.addDialog.options = {
      width: '80%',
      height: '80vh',
      showOverlay: true,
      animationIn: AppearanceAnimation.ZOOM_IN_ROTATE,
      animationOut: DisappearanceAnimation.ZOOM_OUT_ROTATE,
    };
    this.updateDialog.openDialog(optionalPayload).subscribe((resp) => {
      console.log('Response from dialog content:', resp);
      // Refresh the data after adding a new petty cash entry
      this.getAllStoreCategories();
    });
  }

  openDialogUpdateStoreCategory(optionalPayload?: any) {
    this.updateDialog.options = {
      width: '80%',
      height: '80vh',
      showOverlay: true,
      animationIn: AppearanceAnimation.ZOOM_IN_ROTATE,
      animationOut: DisappearanceAnimation.ZOOM_OUT_ROTATE,
    };
    this.updateDialog.openDialog(optionalPayload).subscribe((resp) => {
      console.log('Response from dialog content:', resp);
      // Refresh the data after adding a new petty cash entry
      this.getAllStoreCategories();
    });
  }
}
