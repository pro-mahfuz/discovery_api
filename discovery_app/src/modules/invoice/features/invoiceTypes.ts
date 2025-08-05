import { Category } from "../../category/features/categoryTypes";
import { Party } from "../../party/features/partyTypes";
import { InvoiceType } from "../../types";

// Item interface
export interface Item {
  id?: number;
  containerId?: number;
  itemId?: number;
  name?: string;
  price: number;
  quantity: number;
  subTotal: number;
}


// Invoice interface
export interface Invoice {
  id?: number; 
  businessId?: number;                 
  categoryId: number | string;
  invoiceType: string;
  partyId: number | string;
  party?: Party;
  date: string;
  note: string;
  totalAmount: number;
  category?: Category;
  items: Item[]; 
  currency: string;
  netStock?: number;
}

export interface InvoiceState {
  data: Invoice[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
