import { Item } from './itemTypes.ts';
import { RootState } from "../../../store/store.ts";

export const selectItemStatus = (state: RootState) => state.item.status;
export const selectItemError = (state: RootState) => state.item.error;

export const selectAllItem = (state: RootState): Item[] => state.item.data || [];

export const selectItemById = (id: number) => (state: RootState) => state.item.data.find(item => item.id === id);
