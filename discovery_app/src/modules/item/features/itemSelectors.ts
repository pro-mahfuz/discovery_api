import { Item } from './itemTypes.ts';
import { RootState } from "../../../store/store.ts";
import { createSelector } from '@reduxjs/toolkit';

export const selectItemStatus = (state: RootState) => state.item.status;
export const selectItemError = (state: RootState) => state.item.error;

export const selectAllItem = (state: RootState): Item[] => state.item.items || [];

export const selectItemById = (id: number) => (state: RootState) => state.item.items.find(item => item.id === id);


export const selectItemByCategory = (categoryId: number) =>
  createSelector(
    [selectAllItem],
    (items) => items.filter((item) => item.categoryId === categoryId)
  );

