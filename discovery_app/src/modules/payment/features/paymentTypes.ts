export type OptionType = {
  label: string;
  value: string;
};

export const paymentOptions:  OptionType[] = [
    { value: "payment_out", label: "Make Payment" },
    { value: "payment_in", label: "Received Payment" },
    { value: "expense", label: "Expense" },
];

export  const paymentMethodOptions:  OptionType[] = [
    { value: "cash", label: "Cash" },
    { value: "bank", label: "Bank" },
];

export interface Payment {
  id?: number;   
  businessId?: number;        
  invoiceId?: number | null;
  categoryId?: number | null;
  partyId?: number;
  paymentType: string;
  paymentDate: string;
  note?: string;
  amountPaid: number;
  paymentMethod: string;
  paymentDetails?: string;
  currency: string;
}

export interface PaymentState {
  data: Payment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}