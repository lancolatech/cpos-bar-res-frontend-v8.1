import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/modules/menu/interfaces/category';
import { product } from 'src/app/modules/menu/interfaces/menuItems.interface';
import { MenuService } from 'src/app/modules/menu/services/menu.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss'],
})
export class RecipeComponent implements OnInit {
  ingredients: any[] = [];
  recipe: {
    product: {
      id: string | null;
      product_name: string;
      category_id: string | null;
    };
    serving_size: number;
    ingredients: {
      ingredient_id: string | null;
      quantity: number;
      unit: string;
    }[];
  } = {
    product: { id: null, product_name: '', category_id: null },
    serving_size: 20, // Default serving size
    ingredients: [{ ingredient_id: null, quantity: 0, unit: '' }],
  };
  products: product[] = [];

  constructor(
    private adminService: AdminService,
    private router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit() {
    this.getAllIngredients();
    this.getAllProducts();
  }
  onProductSelect(event: Event) {
    const selectedProductId = (event.target as HTMLSelectElement).value;
    const selectedProduct = this.products.find(
      (product) => product.id === selectedProductId
    );
    if (selectedProduct) {
      this.recipe.product.product_name = selectedProduct.product_name;
    }
  }

  onSubmit() {
    if (
      !this.recipe.product.id ||
      !this.recipe.product.product_name ||
      this.recipe.serving_size <= 0
    ) {
      console.error('Please fill in all required fields');
      return;
    }

    if (
      this.recipe.ingredients.some(
        (ing) => !ing.ingredient_id || ing.quantity <= 0 || !ing.unit
      )
    ) {
      console.error('Please fill in all ingredient details');
      return;
    }

    const data = {
      product_id: this.recipe.product.id,
      product_name: this.recipe.product.product_name,
      serving_size: this.recipe.serving_size,
      ingredients: this.recipe.ingredients,
    };

    console.log('Recipe to be submitted ', data);

    this.adminService.createRecipe(data).subscribe(
      (response: any) => {
        console.log('Recipe created successfully');
        // You might want to navigate to a different page or clear the form here
      },
      (error) => console.error('Error creating recipe:', error)
    );
  }

  addIngredient() {
    this.recipe.ingredients.push({
      ingredient_id: null,
      quantity: 0,
      unit: '',
    });
  }

  removeIngredient(index: number) {
    this.recipe.ingredients.splice(index, 1);
  }

  getAllIngredients() {
    this.adminService.getIngredient().subscribe((data: any) => {
      this.ingredients = data;
      console.log(this.ingredients);
    });
  }

  getAllProducts() {
    this.menuService.getAllProducts().subscribe((data: any) => {
      this.products = data;
      console.log(this.products);
    });
  }
}
