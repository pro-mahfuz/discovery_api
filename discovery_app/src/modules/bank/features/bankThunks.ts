import { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Bank } from './bankTypes';
import * as bankAPI from '../features/bankAPI';

export const fetchAllBank = createAsyncThunk<Bank[], void, { rejectValue: string }>(
  'bank/fetchAll', async (_, thunkAPI) => {
    try {

      const data = await bankAPI.fetchAll();
      console.log("Bank Thunk Response: ", data);
      return data;
      
    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch');
    }
  }
);

export const create = createAsyncThunk<Bank, Bank, { rejectValue: string }>(
  'bank/create', async (createData, thunkAPI) => {
    try {
      const data = await bankAPI.create(createData);
      return data;

    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create'
      );

    }
  }
);

export const fetchById = createAsyncThunk<Bank, number, { rejectValue: string }>(
  'bank/fetchById', async (id, thunkAPI) => {
    try {

      const data = await bankAPI.fetchById(id);
      return data;

    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch'
      );

    }
  }
);

export const update = createAsyncThunk<Bank, Bank, { rejectValue: string }>(
  'bank/update', async (updatedData, thunkAPI) => {
    try {

      if (typeof updatedData.id !== 'number') {
        return thunkAPI.rejectWithValue("Bank ID is missing or invalid");
      }

      const data = await bankAPI.update(updatedData);
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
  'bank/delete', async (id, thunkAPI) => {
    try {

      await bankAPI.destroy(id);
      return id;
      
    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete'
      );

    }
  }
);


