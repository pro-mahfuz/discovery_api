import axiosInstance from "../../../api/axios";
import { Payment } from './paymentTypes';

export const fetchAll = async () => {
  try {

    const res = await axiosInstance.get('protected/payment/list');
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const create = async (createData: Payment) => {
  try {

    const res = await axiosInstance.post('protected/payment/create', createData);
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const fetchById = async (id: number) => {
  try {

    const res = await axiosInstance.get(`protected/payment/${id}/view`);
    return res.data.data;

  } catch {
    throw new Error('Failed to fetch');
  }
};

export const update = async (updateData: Payment) => {
  try {

    const res = await axiosInstance.put(`protected/payment/update`, updateData);
    return res.data.data;

  } catch {
    throw new Error('Failed to update');
  }
};

export const destroy = async (id: number) => {
  try {

    const res = await axiosInstance.post(`protected/payment/${id}/delete`);
    return res.data.data;

  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

