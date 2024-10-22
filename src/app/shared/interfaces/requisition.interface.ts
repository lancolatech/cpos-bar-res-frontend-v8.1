export interface RequisitionInterface {
    id: string;
    department: string;
    date: string;
    item: RequisitionItem[];
    requestedBy: string;
    status: string;
    createdAt: string;
    createdBy: string;
    approvedBy?: string;
  }
  
  export interface RequisitionItem {
    productId: string;
    quantity: number;
  }