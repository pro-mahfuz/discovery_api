import { Permission } from "../../permission/features/permissionTypes";

export interface Role {
  id: number;
  name: string;
  action: string;
  Permissions: Permission[],
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoleState {
  roles: Role[],
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface SetRoleRequest {
  roleId: number;
  name: string;
  permissionIds: number[]
}

export interface CreateRoleRequest {
  name: string;
  permissionIds: number[]
}