import { Invoice } from "../../invoice/features/invoiceTypes";
import { Container } from "../../container/features/containerTypes";

// Item interface
export interface Item {
  id?: number;
  containerId?: number;
  itemId?: number;
  name?: string;
  price: number;
  quantity: number;
  unit?: string;
  subTotal: number;
  invoice?: Invoice;
  container?: Container;
}

export interface ItemState {
  data: Item[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}