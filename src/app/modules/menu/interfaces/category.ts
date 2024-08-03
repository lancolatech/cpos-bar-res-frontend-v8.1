import { product } from "./products";

export interface Category {
    id: number;
    category_name: string;
    num_products: number;
    icon: string;
    products: product[];
    color: string;
    deleted:boolean;
  }