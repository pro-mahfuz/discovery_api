// Invoice interface
export interface Category {
    id?: number;
    businessId: number;
    name: string;
    isAction: boolean;
}

export interface CategoryState {
  data: Category[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
