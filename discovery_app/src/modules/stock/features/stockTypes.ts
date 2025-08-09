import { Container } from "../../container/features/containerTypes";
import { Warehouse } from "../../warehouse/features/warehouseTypes";
import { Item } from "../../item/features/itemTypes";
import { Business } from "../../business/features/businessTypes";

export interface Stock {
  id?: number;
  date: string;
  businessId?: number;
  business?: Business;
  invoiceType?: string;
  invoiceId?: number;
  itemId: number;
  item?: Item;
  containerId: number;
  container?: Container;
  movementType: string;
  warehouseId: number;
  warehouse?: Warehouse;
  quantity: number;
  stockUnit: string;
  createdBy?: number;
  updatedBy?: number;
  createdByUser?: string;
  updatedByUser?: string;
}

export interface StockState {
  data: Stock[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}