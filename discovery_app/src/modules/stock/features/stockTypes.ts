export interface Stock {
  id?: number;
  date: string;
  businessId?: number;
  invoiceType?: string;
  invoiceId?: number;
  itemId: number;
  containerId: number;
  movementType: string;
  warehouseId: number;
  quantity: number;
}

export interface StockState {
  data: Stock[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}