import { Role } from './roleTypes.ts';
import { RootState } from "../../../store/store.ts";

export const selectAllRoles = (state: RootState): Role[] => state.role.roles;
export const selectRoleStatus = (state: RootState) => state.role.status;