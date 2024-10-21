import { Component } from '@angular/core';

@Component({
  selector: 'app-store-categories',
  templateUrl: './store-categories.component.html',
  styleUrls: ['./store-categories.component.scss'],
})
export class StoreCategoriesComponent {
  @Input() storeCategoryId: string = '';

  private addDialog: DialogRemoteControl = new DialogRemoteControl(
    AddStoreCategoryComponent
  );

  private updateDialog: DialogRemoteControl = new DialogRemoteControl(
    UpdateStoreCategoryComponent
  );

  storeCategories: storeCategory[] = [];

  constructor(private storeCategoriesService: StoreCategoriesService) {}

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
