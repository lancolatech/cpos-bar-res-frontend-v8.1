import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/modules/menu/interfaces/categories';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { ProductIDService } from '../../services/product-id.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent  implements OnInit{
  @Input() category: Category | null = null;
  categoryName: string = '';
  categoryIcon: File | null = null;
  editedCategory: any = {};


  constructor(private menuService: MenuService,private notificationService:HotToastService,private router:Router, private productIdService:ProductIDService) {}

  ngOnInit(): void {
    // if (this.category) {
    //   this.categoryName = this.category.category_name;
    // }

    this.category = this.productIdService.getCategoryData();
    if (this.category) {
      this.editedCategory = { ...this.category }; // Load existing product data into editedProduct
    }
  }

  onFileSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.categoryIcon = fileList[0];
    }
  }

  onSubmit() {
    if (this.editedCategory && this.editedCategory.id) {
      const id = this.editedCategory.id;
      const categoryData = {
        category_name: this.editedCategory.category_name, // Replace with the appropriate property name
        // Add other properties as needed based on your category model
      };
  
      this.menuService.updateCategory(id, categoryData)

        .subscribe(
          (response) => {
            this.notificationService.success('Category Updated');

            this.router.navigate(['/admin/categories']);
          },
          (error) => {
            // Handle error, show an error message or perform appropriate actions
            console.error('Error updating category:', error);
            this.notificationService.error('Category Failed To Update');

          }
        );
    } else {
      // Handle case where the category or category ID is not available
      console.error('No category or category ID available for update');
    }
  }
}  
