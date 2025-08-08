import { Ledger } from './ledgerTypes.ts';
import { RootState } from "../../../store/store.ts";
import { createSelector } from 'reselect';

export const selectLedgerStatus = (state: RootState) => state.ledger.status;
export const selectLedgerError = (state: RootState) => state.ledger.error;

export const selectAllLedger = (state: RootState): Ledger[] => state.ledger.data || [];

export const selectLedgers = (businessId: number, categoryId: number, partyId: number) => 
    createSelector([selectAllLedger], (ledgers) => {
    return businessId === 0 ? ledgers :
    businessId > 0 && categoryId === 0 && partyId === 0 ? ledgers.filter(ledger => ledger.businessId === businessId) :
    businessId > 0 && categoryId > 0 && partyId === 0 ? ledgers.filter(ledger => ledger.categoryId === categoryId && ledger.businessId === businessId) :
    businessId > 0 && categoryId > 0 && partyId > 0 ? ledgers.filter(ledger => ledger.categoryId === categoryId && ledger.partyId === partyId  && ledger.businessId === businessId) :
    [];
    });

export const selectLedgerByPartyType = (businessId: number, partyType: string) => (state: RootState): Ledger[] => {
    if (businessId === 0) return state.ledger.data;

    if (businessId > 0 && partyType === "supplier") {
      return state.ledger.data.filter(
        (ledger) =>
          ledger.businessId === businessId &&
          (ledger.transactionType === "purchase" || ledger.transactionType === "payment_out")
      );
    }

    if (businessId > 0 && partyType === "customer") {
      return state.ledger.data.filter(
        (ledger) =>
          ledger.businessId === businessId &&
          (ledger.transactionType === "sale" || ledger.transactionType === "payment_in")
      );
    }

    return [];
}

