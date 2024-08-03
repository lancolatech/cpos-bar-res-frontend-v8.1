import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-show-all-recipe',
  templateUrl: './show-all-recipe.component.html',
  styleUrls: ['./show-all-recipe.component.scss'],
})
export class ShowAllRecipeComponent {
  recipe: any;
  incredients: any;
  constructor(private adminService: AdminService) {}
  ngOnInit(): void {
    this.getAllRecipe();
    this.getAllIncredients();
  }

  getAllRecipe() {
    this.adminService.getAllRecipe().subscribe((data: any) => {
      this.recipe = data;
      console.log('recipe', this.recipe);
    });
  }

  getAllIncredients() {
    this.adminService.getIngredient().subscribe((data: any) => {
      this.incredients = data;
      console.log('incredients', this.incredients);
    });
  }
  getIncredientNameById(id: any): string {
    const incredient = this.incredients.find((incredient: { id: any }) => {
      return incredient.id === id;
    });
    if (incredient) {
      return incredient.name;
    } else {
      return 'Loading...';
    }
  }
}
