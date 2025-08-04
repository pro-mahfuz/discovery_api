import { Container } from './containerTypes.ts';
import { RootState } from "../../../store/store.ts";

export const selectContainerStatus = (state: RootState) => state.container.status;
export const selectContainerError = (state: RootState) => state.container.error;

export const selectAllContainer = (state: RootState): Container[] => state.container.data.filter(container => container.isActive === true) || [];

export const selectContainerById = (id: number) => (state: RootState) => state.container.data.find(container => container.id === id);



