
import { Category } from "../../category/features/categoryTypes";
import { Party } from "../../party/features/partyTypes";
import { Invoice } from "../../invoice/features/invoiceTypes";


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
  invoiceRefId?: string;
  partyId?: number;
  paymentRefNo?: string;
  paymentType: string;
  paymentDate: string;
  note?: string;
  amountPaid: number;
  paymentMethod: string;
  paymentDetails?: string;
  currency: string;
  category?: Category;
  invoice?: Invoice;
  party?: Party;
  createdBy?: number;
  updatedBy?: number;
  createdByUser?: string;
  updatedByUser?: string;
}

export interface PaymentState {
  data: Payment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}