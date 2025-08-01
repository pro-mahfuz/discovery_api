export type OptionType = {
  label: string;
  value: string;
};

export const paymentOptions:  OptionType[] = [
    { value: "payment_out", label: "Make Payment" },
    { value: "payment_in", label: "Received Payment" },
];

export  const paymentMethodOptions:  OptionType[] = [
    { value: "cash", label: "Cash" },
    { value: "bank", label: "Bank" },
];

export interface Payment {
  id?: number;   
  businessId: number;        
  partyId: number;
  categoryId: number;
  paymentType: "payment_in" | "payment_out";
  invoiceId?: number | null;
  paymentDate: string;
  note?: string;
  amountPaid: number;
  paymentMethod: "cash" | "bank",
  paymentDetails?: string
}

export interface PaymentState {
  data: Payment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}