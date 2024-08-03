export interface product {
  buying_price: any;
  id: any;
  product_name: string;
  product_price: string;
  product_quantity: string;
  selectedItems?: number;
}

export interface Item {
  itemId: number;
  itemName: string;
  itemPrice: number;
  ordersType: string;
  itemCategory: string;
  orderCount: number;
}

export interface menuItem {
  showDeleteIcon: boolean;
  category: string;
  description: string;
  is_service: string;
  loyalty_points: string;
  picture: string;
  product_code: string;
  product_name: string;
  promoted: string;
  sale_price: string;
  product_price: string;
  special_price: string;
  unit_of_measure: string;
  uom: string;
  vatable: string;
  orderCount: number;
  product_no: string;
  totalPrice: string;
  selectedItems: number;
}
