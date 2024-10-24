export interface Inventory {
    id: string; 
    product_id: string;
    quantity: number;
    buying_price: number;
    added_by: string;
    total: number;
    deleted: boolean;
    createdAt: Date; 
  }