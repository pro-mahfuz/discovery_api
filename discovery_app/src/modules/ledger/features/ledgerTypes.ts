import { Party } from "../../party/features/partyTypes.ts";

export interface Category {
  id: number;
  name: string;
  isAction: boolean;
}

export interface Ledger {
  id?: number;
  businessId: number;                  // Optional for creation
  categoryId: number;           // Reference to invoice category
  transactionType: "purchase" | "sale" | "return" | "payment_in" | "payment_out";
  partyId: number;              // Vendor or customer
  date: string;  
  referenceId: number;               // ISO string or date format (e.g. "2025-07-28")
  description: string; 
  currency: string;
  debit: number;
  credit: number;
  balance: number;
  party?: Party;
  category?: Category;
}

export interface LedgerState {
  data: Ledger[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}