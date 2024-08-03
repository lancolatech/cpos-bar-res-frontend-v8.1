export interface DatabaseItemInterface {
  id?: string,
  createdBy: string,
  deletedBy?: string,
  deleted?: boolean,
  created_at?: string,
  updated_at?: string,
}

export type FirebaseCollectionTypes =
  | 'orders'
  | 'shifts'
  | 'advanced_orders'
  | 'payments'
  | 'products'
  | 'inventory'
  | 'purchases'
  | 'credit_sales'
  | 'credit_sale_payments'
  | 'take_out_sales'
  | 'categories'
  | 'inventory_movements'
  | 'petty_cash'
  | 'room_bookings'
  | 'take_out_awards'
  | 'room_sales'
  | 'rooms'
  | 'take_out_organizations'
  | 'customer_details'
  | 'recipes'
  | 'ingredients'
  | 'users'
  | 'suppliers'
  | 'permissions'

