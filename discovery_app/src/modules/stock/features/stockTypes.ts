export interface Stock {
  id?: number;
  businessId?: number;
  invoiceType: string;
  invoiceId: number;
  movementType: string;
  quantity: number;
  warehouseId?: number;
  containerId: number;
  itemId: number;
}