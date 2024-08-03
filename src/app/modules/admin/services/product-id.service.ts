import { Injectable } from '@angular/core';
import { product } from '../../menu/interfaces/products';
import { Category } from '../../menu/interfaces/categories';
import { UserInterface } from 'src/app/shared/interfaces/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductIDService {
  constructor() {}

  productData: product | null = null;
  categoryData: Category | null = null;
  userData: UserInterface | null = null;

  setProductData(product: product) {
    this.productData = product;
  }

  getProductData(): product | null {
    return this.productData;
  }
  getCategoryData(): Category | null {
    return this.categoryData;
  }

  setCategoryData(category: Category) {
    this.categoryData = category;
  }

  getUserData(): UserInterface | null {
    return this.userData;
  }
  setUserData(user: UserInterface) {
    this.userData = user;
  }
}
