import { Category } from "../../category/features/categoryTypes";
import { Party } from "../../party/features/partyTypes";
import { Item } from "../../item/features/itemTypes.ts";

// Invoice interface
export interface Invoice {
  id?: number; 
  invoiceRefId?: number;
  businessId?: number;                 
  categoryId: number | string;
  prefix?: string;
  invoiceNo?: string;
  invoiceType: string;
  partyId: number | string;
  party?: Party;
  date: string;
  note: string;
  totalAmount: number;
  discount?: number;
  isVat?: boolean;
  vatPercentage?: number;
  grandTotal?: number;
  category?: Category;
  items: Item[]; 
  currency: string;
  netStock?: number;
  createdBy?: number;
  updatedBy?: number;
  createdByUser?: string;
  updatedByUser?: string;
}


export interface InvoiceState {
  data: Invoice[];
  report: Item[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
