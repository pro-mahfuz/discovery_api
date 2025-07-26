import { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Party } from './partyTypes';
import * as partyAPI from '../features/partyAPI';

export const fetchParty = createAsyncThunk<Party[], void, { rejectValue: string }>(
  'party/fetch', async (_, thunkAPI) => {
    try {

      const parties = await partyAPI.fetchParty();
      return parties;
      
    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch party'
      );
    }
  }
);

export const createParty = createAsyncThunk<Party, Party, { rejectValue: string }>(
  'party/create', async (partyData, thunkAPI) => {
    try {
      const newParty = await partyAPI.createParty(partyData);
      return newParty;

    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create party'
      );

    }
  }
);

export const fetchPartyById = createAsyncThunk<Party, number, { rejectValue: string }>(
  'party/fetchPartyById', async (id, thunkAPI) => {
    try {

      const party = await partyAPI.fetchPartyById(id);
      return party;

    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch party'
      );

    }
  }
);

export const updateParty = createAsyncThunk<Party, Party, { rejectValue: string }>(
  'party/update', async (updatedParty, thunkAPI) => {
    try {

      if (typeof updatedParty.id !== 'number') {
        return thunkAPI.rejectWithValue("Party ID is missing or invalid");
      }

      const party = await partyAPI.updateParty(updatedParty.id, updatedParty);
      return party;

    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update party'
      );

    }
  }
);

export const deleteParty = createAsyncThunk<any, number, { rejectValue: string }>(
  'party/delete', async (id, thunkAPI) => {
    try {

      await partyAPI.deleteParty(id);
      return id;
      
    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete party'
      );

    }
  }
);


