import axiosInstance from "../../../api/axios";
import { Invoice } from './invoiceTypes';

export const fetchAll = async () => {
  try {

    const res = await axiosInstance.get('protected/invoice/list');
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const getSaleReport = async () => {
  try {

    const res = await axiosInstance.post('protected/invoice/getSaleReport');
    console.log(res.data.data);
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const getSalePaymentReport = async () => {
  try {

    const res = await axiosInstance.post('protected/invoice/getSalePaymentReport');
    console.log("res.data.data: ", res.data.data);
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const create = async (createData: Invoice) => {
  try {

    const res = await axiosInstance.post('protected/invoice/create', createData);
    return res.data.data;

  } catch {
    throw new Error('No data available');
  }
};

export const fetchById = async (id: number) => {
  try {

    const res = await axiosInstance.get(`protected/invoice/${id}/view`);
    return res.data.data;

  } catch {
    throw new Error('Failed to fetch');
  }
};

export const update = async (updateData: Invoice) => {
  try {

    const res = await axiosInstance.put(`protected/invoice/update`, updateData);
    return res.data.data;

  } catch {
    throw new Error('Failed to update');
  }
};

export const destroy = async (id: number) => {
  try {

    const res = await axiosInstance.post(`protected/invoice/${id}/delete`);
    return res.data.data;

  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

