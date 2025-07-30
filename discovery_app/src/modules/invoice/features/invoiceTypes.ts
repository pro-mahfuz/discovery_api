
export type OptionType = {
  label: string;
  value: string;
};

export const categoryOptions:  OptionType[] = [
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
  id?: number;
  itemId?: number;
  name?: string;
  price: number;
  quantity: number;
  subTotal: number;
}


// Invoice interface
export interface Invoice {
  id?: number;                  // Optional for creation
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
