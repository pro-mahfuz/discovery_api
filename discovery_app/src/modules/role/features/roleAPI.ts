
import axiosInstance from "../../../api/axios";
import { Role, SetRoleRequest, CreateRoleRequest } from './roleTypes';

export const fetchRole = async () => {
  try {

    const res = await axiosInstance.get('protected/roles');
    
    return res.data.data.map((role: Role): Role => (
      {
        id: role.id,
        name: role.name,
        action: role.action,
        isActive: role.isActive,
        Permissions: role.Permissions,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
      }
    ));

  } catch {
      throw new Error('No data available');
  }
};


export const fetchRoleById = async (id: number) => {
  try {

    const res = await axiosInstance.get(`protected/get-permissions/${id}`);
    console.log("fetch Role API", res.data.data);
    return res.data.data;

  } catch {
      throw new Error('No data available');
  }
};

export const createRole = async (createData: CreateRoleRequest) => {
  try {

    const res = await axiosInstance.post('protected/set-permissions', createData);
    
    return res.data.data;

  } catch {
      throw new Error('No data available');
  }
};

export const updateRole = async (updataData: SetRoleRequest) => {
  try {

    const res = await axiosInstance.post('protected/set-permissions', updataData);
    console.log(res.data.data);
    
    return res.data.data;

  } catch {
      throw new Error('No data available');
  }
};

export const deleteRole = async (id: number) => {
  try {

    const res = await axiosInstance.post(`protected/roles/${id}/deactive`);
    console.log("Role deleted successfully:", res.data);
    return res.data.data;

  } catch {
    
    throw new Error('Failed to delete role');
  }
};