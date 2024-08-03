import { SelectedOrder } from "../../orders/Interfaces/SelectedOrder";

export interface product {
  deleted: any;
is_service: any;
  quantityToAdd: any;
  category_id: any;
  Items:string;
price: any;
name: any;
id:any;  // Allow both number and string for id
product_name: string;
  product_price: string;
  product_quantity: any;
  store_quantity: any;
  buying_price: any;
  selectedItems?: number;
  pax?: number;
  selectedOrder: SelectedOrder[];
  showDeleteIcon: boolean;
  recipe_id: any;
  is_kitchen_product: boolean;
  specification:any;
  selectedSpecification?: any;
}
