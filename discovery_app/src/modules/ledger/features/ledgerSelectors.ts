import { Ledger } from './ledgerTypes.ts';
import { RootState } from "../../../store/store.ts";

export const selectLedgerStatus = (state: RootState) => state.ledger.status;
export const selectLedgerError = (state: RootState) => state.ledger.error;

export const selectAllLedger = (state: RootState): Ledger[] => state.ledger.data || [];
export const selectLedgers = (categoryId: number) => (state: RootState): Ledger[] => state.ledger.data.filter(ledger => ledger.categoryId === categoryId);

export const selectLedgerById = (id: number) => (state: RootState) => state.ledger.data.find(ledger => ledger.id === id);
export const selectLedgerByPartyId = (id: number) => (state: RootState): Ledger[] => state.ledger.data.filter(ledger => ledger.partyId === id);

