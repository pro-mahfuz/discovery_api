import { Invoice } from './invoiceTypes.ts';
import { Item } from "../../item/features/itemTypes.ts";
import { RootState } from "../../../store/store.ts";
import { createSelector } from 'reselect';

export const selectInvoiceStatus = (state: RootState) => state.invoice.status;
export const selectInvoiceError = (state: RootState) => state.invoice.error;

export const selectAllInvoice = (state: RootState): Invoice[] => state.invoice.data || [];

export const selectInvoiceAll = (state: RootState): Invoice[] => state.invoice.data || [];

export const selectAllSaleReport = (state: RootState): Item[] => state.invoice.saleReport || [];
export const selectAllSalePaymentReport = (state: RootState): Invoice[] => state.invoice.salePaymentReport || [];

export const selectSaleReport = (containerId: number) => (state: RootState): Invoice[] => {
  return containerId > 0 ? 
  state.invoice.data
    .map(invoice => ({
      ...invoice,
      items: invoice.items?.filter(item => item.containerId === containerId) || [],
    }))
    // Optionally filter out invoices with no matching items
    .filter(invoice => invoice.items.length > 0)
  : state.invoice.data
};

export const selectAllInvoiceByType = (invoiceType: String) =>
  createSelector([selectAllInvoice], (invoices) => {
  return invoiceType === "all" ?
  invoices :
  invoices.filter(invoice => invoice.invoiceType === invoiceType) || [];
  });

export const selectInvoiceById = (id: number) => (state: RootState) => state.invoice.data.find(invoice => invoice.id === id);

export const selectPurchaseInvoice = createSelector(
  [selectAllInvoice],
  (invoices) => invoices.filter(invoice => invoice.invoiceType === 'purchase')
);

export const selectSaleInvoice = createSelector(
  [selectAllInvoice],
  (parties) => parties.filter(invoice => invoice.invoiceType === 'sale')
);

