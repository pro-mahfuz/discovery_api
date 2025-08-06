import { Item } from './itemTypes.ts';
import { RootState } from "../../../store/store.ts";
import { createSelector } from '@reduxjs/toolkit';

export const selectItemStatus = (state: RootState) => state.item.status;
export const selectItemError = (state: RootState) => state.item.error;

export const selectAllItem = (state: RootState): Item[] => state.item.data || [];

export const selectItemById = (id: number) => (state: RootState) => state.item.data.find(item => item.id === id);


// export const selectItemByCategory = (categoryId: number) =>
//   createSelector(
//     [selectAllItem],
//     (data) => data.filter((item) => item.categoryId === categoryId)
//   );

