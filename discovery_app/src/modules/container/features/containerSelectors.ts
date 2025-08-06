import { Container } from './containerTypes.ts';
import { RootState } from "../../../store/store.ts";

export const selectContainerStatus = (state: RootState) => state.container.status;
export const selectContainerError = (state: RootState) => state.container.error;

export const selectAllContainer = (state: RootState): Container[] => state.container.data.filter(container => container.isActive === true) || [];
export const selectAllContainerByItemId = (itemId: number) => (state: RootState) => 
    state.container.data.filter(container => container.itemId === itemId);

export const selectContainerById = (id: number) => (state: RootState) => state.container.data.find(container => container.id === id);

export const selectStockByContainerId = (containerId: number, itemId: number) => (state: RootState) => {
  const container = state.container.data.find(
    (c) => c.id === containerId && c.item?.id === itemId
  );

  if (!container || !container.stock) return 0;

  return container.stock.reduce((total, stock) => {
    const quantity = stock.quantity ?? 0;
    return stock.invoiceType === "purchase"
      ? total + quantity
      : total - quantity;
  }, 0);
};

export const selectContainerByItemId = (categoryId: number, itemId: number) => (state: RootState) => 
    state.container.data.filter(container => container.categoryId === categoryId && container.itemId === itemId);



