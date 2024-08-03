import { product } from './products';

export interface Category {
  id: string;
  category_name: string;
  num_products: number;
  icon: string;
  products: product[];
  color: string;
  deleted: boolean;
}
