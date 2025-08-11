import axiosInstance from "../../../api/axios";
import { Bank } from './bankTypes';

export const fetchAll = async () => {
  try {

    const res = await axiosInstance.get('protected/bank/list');
    console.log("Bank.response: ", res.data.data);
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const create = async (createData: Bank) => {
  try {

    const res = await axiosInstance.post('protected/bank/create', createData);
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const fetchById = async (id: number) => {
  try {

    const res = await axiosInstance.get(`protected/bank/${id}/view`);
    return res.data.data;

  } catch {
    throw new Error('Failed to fetch');
  }
};

export const update = async (updateData: Bank) => {
  try {

    const res = await axiosInstance.put(`protected/bank/update`, updateData);
    return res.data.data;

  } catch {
    throw new Error('Failed to update');
  }
};

export const destroy = async (id: number) => {
  try {

    const res = await axiosInstance.post(`protected/bank/${id}/delete`);
    return res.data.data;

  } catch {
    throw new Error('Failed to delete');
  }
};

