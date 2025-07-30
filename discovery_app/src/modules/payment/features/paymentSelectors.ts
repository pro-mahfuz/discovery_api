import { Payment } from './paymentTypes.ts';
import { RootState } from "../../../store/store.ts";

export const selectPaymentStatus = (state: RootState) => state.payment.status;
export const selectPaymentError = (state: RootState) => state.payment.error;

export const selectAllPayment = (state: RootState): Payment[] => state.payment.data || [];

export const selectPaymentById = (id: number) => (state: RootState) => state.payment.data.find(payment => payment.id === id);
