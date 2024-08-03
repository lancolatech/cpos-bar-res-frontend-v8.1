import { DatabaseItemInterface } from './database-item.interface';

export interface OrganizationInterface extends DatabaseItemInterface {
  id: string;
  org_code: string;
  address: string;
  deleted: boolean;
  name: string;
  phone: string;
  email: string;
  location: string;
  imageURL: string;
  daysLeft: number;
  status: string;
  expiry_date: string;
}

export interface OrgOptionsInterface extends DatabaseItemInterface {
  has_advance_orders: number | boolean;
  has_credit_sale: number | boolean;
  has_reception: number | boolean;
  has_tables: number | boolean;
  has_shifts: number | boolean;
  has_takeout: number | boolean;
  reorder_level: number;
  store_products: number | boolean;
}
