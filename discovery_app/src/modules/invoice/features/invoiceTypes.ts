import { Category } from "../../category/features/categoryTypes";
import { Party } from "../../party/features/partyTypes";

// Item interface
export interface Item {
  id?: number;
  itemId?: number;
  name?: string;
  price: number;
  quantity: number;
  subTotal: number;
}


// Invoice interface
export interface Invoice {
  id?: number; 
  businessId: number;                 
  categoryId: number | string;
  invoiceType: "purchase" | "sale" | "return" | "damaged";
  partyId: number | string;
  party?: Party;
  date: string;
  note: string;
  totalAmount: number;
  category?: Category;
  items: Item[];            
}

export interface InvoiceState {
  data: Invoice[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
