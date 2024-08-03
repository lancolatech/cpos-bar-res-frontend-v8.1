import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { error } from 'jquery';
import { MenuService } from 'src/app/modules/menu/services/menu.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {
  private apiUrl = `${environment.apiRootUrl}/categories`;
  categoryName: string = '';
  categoryIcon: File | null = null; // Initialize categoryIcon to null

  constructor(private http: HttpClient,
    private menuService: MenuService,
    private toast:HotToastService
  ) {}

  onSubmit() {
    const categoryData = new FormData();
    categoryData.append('category_name', this.categoryName);

    if (this.categoryIcon) {
      categoryData.append('icon', this.categoryIcon, this.categoryIcon.name);
    }

    this.http.post(`${this.apiUrl}`, categoryData).subscribe(
      (response: any) => {
        console.log('Category created successfully', response);
        // Reset the form or handle success as needed
        this.categoryName = ''; // Clear the input fields after successful submission
        this.categoryIcon = null;
      },
      (error) => {
        console.error('Error creating category', error);
        // Handle errors, e.g., display an error message to the user
      }
    );
  }
  addCategory(){
   const categoryData = {
      category_name: this.categoryName,
      icon: this.categoryIcon
    }
    this.menuService.addCategory(categoryData).subscribe(data =>{
      console.log(data)
      this.toast.success('Category created successfully');
      
    }
    ,error=>{
      console.log(error)
      this.toast.error('Error creating category');
    }
  )
   
  }

  onFileSelected(event: any) {
    this.categoryIcon = event.target.files[0];
  }



  // categoryForm: FormGroup;

  // constructor(
  //   private formBuilder: FormBuilder,
  //   private menuService: MenuService
  // ) {
  //   this.categoryForm = this.formBuilder.group({
  //     category_name: ['', [Validators.required]],
  //     icon: [null],
  //   });
  // }

  
  // setCategory(categoryName: string, icon: File) {
  //   this.categoryForm.patchValue({
  //     category_name: categoryName,
  //     icon,
  //   });
  // }

  // onSubmit() {
  //   if (this.categoryForm.valid) {
  //     const categoryName = this.categoryForm.get('category_name')!.value;
  //     const icon = this.categoryForm.get('icon')!.value;

  //     const categoryData = new FormData();
  //     categoryData.append('category_name', categoryName);
  //     categoryData.append('icon', icon);

  //     this.menuService.addCategory(categoryData).subscribe(
  //       (response) => {
  //         console.log('Category Added');
  //       },
  //       (error) => {
  //         console.error('Failed to add category:', error);
  //       }
  //     );
  //   }
  // }

}
