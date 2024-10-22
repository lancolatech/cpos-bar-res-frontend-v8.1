import { Items } from './Items';

export interface Orders {
  id: string;
  OrderItems: Items[];
  TableName: string;
  comments: string;
  Items: any;
  Total: any;
  ShiftID: number; // Add ShiftID
  Time: string; // Add Time
  Served_by: string; // Add Served_by
  showDeleteIcon: boolean;
  printerIp?: string;
  orderId?: any;
  is_printed?: boolean;
}
