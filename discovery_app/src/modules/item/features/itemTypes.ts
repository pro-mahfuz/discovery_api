// Item interface
export interface Item {
  id?: number;
  name: string;
  price: number;
  quantity: number;
  subTotal?: number;
}

export interface ItemState {
  items: Item[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}