

export const categoryOptions = [
  { value: "1", label: "Fruit" },
  { value: "2", label: "Vegetable" },
];

export type InvoiceType = "purchase" | "sale" | "return" | "damaged";

export const invoiceTypeOptions: { value: InvoiceType; label: string }[] = [
  { value: "purchase", label: "Purchase" },
  { value: "sale", label: "Sale" },
  { value: "return", label: "Return" },
  { value: "damaged", label: "Damaged" },
];





// Item interface
export interface Item {
  itemId: number;
  quantity: number;
  price: number;
  subTotal: number;
}


// Invoice interface
export interface Invoice {
  id?: number;                  // Optional for creation
  categoryId: number;           // Reference to invoice category
  invoiceType: "purchase" | "sale" | "return" | "damaged";
  partyId: number;              // Vendor or customer
  date: string;                 // ISO string or date format (e.g. "2025-07-28")
  totalAmount: number;          // Total calculated from items
  note?: string;                // Optional note
  items: Item[];                // List of invoice line items
}

export interface InvoiceState {
  data: Invoice[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
