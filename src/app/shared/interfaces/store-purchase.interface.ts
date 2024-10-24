// export interface StorePurchase {
//     id: string;
//     items: purchaseInterface[];
//     supplier_id: string;
//     added_by: string;
//     grandTotal: number;
//     deleted: boolean;
//     paymentMethods: any
//     amountPaid: number;
//     creditAmount?: number;
//   }

//   export interface purchaseInterface {
//     productId: string;
//     price: number;
//     quantity: number;
//     subtotal: number;
//     purchaseType: string;
//   }

export interface StorePurchaseItem {
    name?: any;
    buying_price?: any;
    id?: any;
    quantityToAdd?: any;
    productId: string;
    price: number;
    quantity: number;
    subtotal: number;
    purchaseType: 'single' | 'bulk';
  }
  
  export interface StorePurchase {
    id?: string;
    items: StorePurchaseItem[];
    supplier_id: string;
    added_by: string;
    grandTotal: number;
    deleted: boolean;
    paymentMethods: Array<{
      method: string;
      amount: number;
      transactionId?: string;
    }>;
    amountPaid: number;
    creditAmount?: number;
    created_at?: string;
  }