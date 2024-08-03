import { Component, Input } from '@angular/core';
import { ICategory } from '../../../interfaces/menuCategories.interface';
import { Category } from '../../../interfaces/category';

@Component({
  selector: 'app-menu-order-items',
  templateUrl: './menu-order-items.component.html',
  styleUrls: ['./menu-order-items.component.scss'],
})
export class MenuOrderItemsComponent {
  @Input() category: any | undefined;
  @Input() numberOfProducts: number | undefined;
  @Input() product: any | undefined;
  @Input() color: any | undefined;
}
