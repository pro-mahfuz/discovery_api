
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
  businessId: number;                 // Optional for creation
  categoryId: number | string;
  invoiceType: "purchase" | "sale" | "return" | "damaged";
  partyId: number | string;
  date: string;
  note: string;
  totalAmount: number;
  items: Item[];            // List of invoice line items
}

export interface InvoiceState {
  data: Invoice[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
