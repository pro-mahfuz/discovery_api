import { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Invoice } from './invoiceTypes';
import { Item } from '../../item/features/itemTypes';
import * as invoiceAPI from '../features/invoiceAPI';

export const fetchAllInvoice = createAsyncThunk<Invoice[], void, { rejectValue: string }>(
  'invoice/fetchAll', async (_, thunkAPI) => {
    try {

      const data = await invoiceAPI.fetchAll();
      return data;
      
    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch');
    }
  }
);

export const getSaleReport = createAsyncThunk<Item[], void, { rejectValue: string }>(
  'sale/getSaleReport', async (_, thunkAPI) => {
    try {

      const data = await invoiceAPI.getSaleReport();
      return data;
      
    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch');
    }
  }
);

export const create = createAsyncThunk<Invoice, Invoice, { rejectValue: string }>(
  'invoice/create', async (createData, thunkAPI) => {
    try {
      const data = await invoiceAPI.create(createData);
      return data;

    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create'
      );

    }
  }
);

export const fetchById = createAsyncThunk<Invoice, number, { rejectValue: string }>(
  'invoice/fetchById', async (id, thunkAPI) => {
    try {

      const data = await invoiceAPI.fetchById(id);
      return data;

    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch'
      );

    }
  }
);

export const update = createAsyncThunk<Invoice, Invoice, { rejectValue: string }>(
  'invoice/update', async (updatedData, thunkAPI) => {
    try {

      if (typeof updatedData.id !== 'number') {
        return thunkAPI.rejectWithValue("invoice ID is missing or invalid");
      }

      const data = await invoiceAPI.update(updatedData);
      return data;

    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update'
      );

    }
  }
);

export const destroy = createAsyncThunk<any, number, { rejectValue: string }>(
  'invoice/delete', async (id, thunkAPI) => {
    try {

      await invoiceAPI.destroy(id);
      return id;
      
    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete'
      );

    }
  }
);


