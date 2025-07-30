import { Ledger } from './ledgerTypes.ts';
import { RootState } from "../../../store/store.ts";

export const selectLedgerStatus = (state: RootState) => state.ledger.status;
export const selectLedgerError = (state: RootState) => state.ledger.error;

export const selectAllLedger = (state: RootState): Ledger[] => state.ledger.data || [];

export const selectLedgerById = (id: number) => (state: RootState) => state.ledger.data.find(ledger => ledger.id === id);

