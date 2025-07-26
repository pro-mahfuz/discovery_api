
import axiosInstance from "../../../api/axios";
import { Permission } from './permissionTypes';

export const fetchPermission = async () => {
  try {

    const res = await axiosInstance.get('protected/permissions');
    
    return res.data.data.map((permission: Permission): Permission => (
      {
        id: permission.id,
        name: permission.name,
        action: permission.action,
        createdAt: permission.createdAt,
        updatedAt: permission.updatedAt
      }
    ));

  } catch {
      throw new Error('No data available');
  }
};