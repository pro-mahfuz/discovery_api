import { Bank } from './bankTypes.ts';
import { RootState } from "../../../store/store.ts";

export const selectBankStatus = (state: RootState) => state.bank.status;
export const selectBankError = (state: RootState) => state.bank.error;

export const selectAllBank = (state: RootState): Bank[] => state.bank.data || [];

export const selectBankById = (id: number) => (state: RootState) => state.bank.data.find(bank => bank.id === id);
