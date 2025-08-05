import { User } from "../../user/features/userTypes";
import { Item } from "../../item/features/itemTypes";
import { Stock } from "../../stock/features/stockTypes";

// Item interface
export interface Container {
  id?: number;
  businessId?: number;
  date: string;
  blNo: string;
  soNo?: string;
  oceanVesselName?: string;
  voyageNo?: string;
  agentDetails?: string;
  placeOfReceipt?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  placeOfDelivery?: string;
  containerNo: string;
  sealNo?: string;
  categoryId: number;
  itemId: number;
  containerQuantity: number;
  containerUnit: string;
  stockQuantity: number;
  stockUnit: string;
  item?: Item;
  stock?: Stock[];
  user?: User;
  netStock?: number;
  isActive: boolean;
  createdUserId?: number;
  updatedUserId?: number;
}


export interface ContainerState {
  data: Container[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
