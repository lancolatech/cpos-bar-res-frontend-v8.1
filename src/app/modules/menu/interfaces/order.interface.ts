import { menuItem } from "./menuItems.interface";

export interface posOrder {
  tx_type: string;
  pos_user: string;
  currency: string;
  payment_mode: string;
  customer_no: string;
  temp_id: string;
  date_issued: string;
  discount: number;
  amount_tendered: string;
  original_txn_no: string;
  dest_branch: string;
  orig_branch: string;
  supplierinvoiceno: string;
  lpolsonumber: string;
  tx_description: string;
  tx_instructions: string;
  tx_customer_message: string;
  date_due: string;
  tax_percentage: string;
  catering_levy_rate: string;
  items:any[];
}
