export interface Permission {
  id: string;
  name: string;
  action: string;
}

export interface PermissionState {
  permissions: Permission[],
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}