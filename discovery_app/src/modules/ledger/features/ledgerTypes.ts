import { Party } from "../../party/features/partyTypes.ts";

export interface Category {
  id: number;
  name: string;
  isAction: boolean;
}

export interface Ledger {
  id?: number;
  businessId: number;              
  categoryId: number;         
  transactionType: "purchase" | "sale" | "return" | "payment_in" | "payment_out" | "stock_in" | "stock_out";
  partyId: number;           
  date: string;  
  invoiceId?: number; 
  paymentId?: number; 
  stockId?: number; 
  refNo: string;             
  description: string; 
  currency: string;
  debit: number;
  credit: number;
  debitQty: number;
  creditQty: number;
  balance: number;
  party?: Party;
  category?: Category;
  createdBy?: number;
  updatedBy?: number;
  createdByUser?: string;
  updatedByUser?: string;
}

export interface LedgerState {
  data: Ledger[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}