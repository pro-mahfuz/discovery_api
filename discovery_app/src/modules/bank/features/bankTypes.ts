export interface Bank {
  id?: number;
  businessId?: number;
  accountName: string;
  accountNo: string;
  address: string;
  isActive: boolean;
}

export interface BankState {
  data: Bank[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}