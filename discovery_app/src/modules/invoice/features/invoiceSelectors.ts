import { Invoice } from './invoiceTypes.ts';
import { RootState } from "../../../store/store.ts";
import { createSelector } from 'reselect';

export const selectInvoiceStatus = (state: RootState) => state.invoice.status;
export const selectInvoiceError = (state: RootState) => state.invoice.error;

export const selectAllInvoice = (state: RootState): Invoice[] => state.invoice.data || [];

export const selectInvoiceById = (id: number) => (state: RootState) => state.invoice.data.find(invoice => invoice.id === id);

export const selectPurchaseInvoice = createSelector(
  [selectAllInvoice],
  (invoices) => invoices.filter(invoice => invoice.invoiceType === 'purchase')
);

export const selectSaleInvoice = createSelector(
  [selectAllInvoice],
  (parties) => parties.filter(invoice => invoice.invoiceType === 'sale')
);

