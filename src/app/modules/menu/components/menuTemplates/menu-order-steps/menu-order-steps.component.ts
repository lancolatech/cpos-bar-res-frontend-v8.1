import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item, menuItem } from '../../../interfaces/menuItems.interface';
import { Category } from '../../../interfaces/categories';
import { product } from '../../../interfaces/products';
import { MenuService } from '../../../services/menu.service';

@Component({
  selector: 'app-menu-order-steps',
  templateUrl: './menu-order-steps.component.html',
  styleUrls: ['./menu-order-steps.component.scss']
})
export class MenuOrderStepsComponent implements OnInit {
@Input() menu:menuItem | undefined;

@Input() category: any | undefined
@Input() product: any | undefined

@Output() orderCount: EventEmitter<{actionType:string, itemId:string}> = new EventEmitter();

allProducts: any[] = [];

categories: Category[] = [];
  products: product[] = [];
  productCount: number | undefined; ;
  productsByCategory: { category: Category, products: product[] }[] = [];


constructor(private menuService:MenuService){}
ngOnInit():void{
this.getAllCategories();

}


increaseOrIncreaseOrder(actionType:string, itemId:string){
  this.orderCount.emit({
    actionType:actionType,
    itemId:itemId
  })
  }



  getAllCategories() {
    this.menuService.getCategories().subscribe((data: any) => {
      this.categories = data;
      console.log('Categories:', this.categories); // Log the categories
      const allProducts: product[] = []; // Specify the type as an array of 'product'
  
      this.categories.forEach((category) => {
        category.num_products = category.products.length;
        category.icon = category.icon;
        // Add products to the productsByCategory property
        this.productsByCategory.push({ category, products: category.products });
      });
  
      // Iterate through the productsByCategory array and collect all products
      this.productsByCategory.forEach((categoryData) => {
        categoryData.products.forEach((product) => {
          allProducts.push(product); // Add the product to the allProducts array
        });
      });
      allProducts.forEach((product, index) => {
        console.log(`Product ${index + 1}:`, product);
      });
    });
  }
}

