import { AxiosError } from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { CreateUserRequest, UpdateUserRequest, User, UserProfile } from './userTypes';
import * as userAPI from '../features/userAPI';

export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchUsers', async (_, thunkAPI) => {
    try {

      const users = await userAPI.fetchUser();
      return users;
      
    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch users'
      );
    }
  }
);

export const createUser = createAsyncThunk<User, CreateUserRequest, { rejectValue: string }>(
  'users/create', async (userData, thunkAPI) => {
    try {

      const newUser = await userAPI.createUser(userData);
      return newUser;

    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to create user'
      );

    }
  }
);

export const fetchUserById = createAsyncThunk<User, number, { rejectValue: string }>(
  'users/fetchUserById', async (id, thunkAPI) => {
    try {
      const user = await userAPI.fetchUserById(id);
      return user;

    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch user'
      );

    }
  }
);

export const updateUser = createAsyncThunk<User, UpdateUserRequest, { rejectValue: string }>(
  'users/update', async (updatedUser, thunkAPI) => {
    try {

      const user = await userAPI.updateUser(updatedUser.id, updatedUser);
      return user;

    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update user'
      );

    }
  }
);

export const deleteUser = createAsyncThunk<number, number, { rejectValue: string }>(
  'users/delete', async (id, thunkAPI) => {
    try {

      await userAPI.deleteUser(id);
      return id;
      
    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete user'
      );

    }
  }
);

export const fetchProfile = createAsyncThunk<UserProfile, number, { rejectValue: string }>(
  'users/profile', async (id, thunkAPI) => {
    try {

      const profile = await userAPI.fetchProfileById(id);
      return profile;
      
    } catch (err) {

      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to delete user'
      );

    }
  }
);

export const updateProfileWithFile = createAsyncThunk<
  UserProfile,                                        // Return type
  { id: number; updateData: FormData },               // Payload type
  { rejectValue: string }                             // ThunkAPI config
>(
  'users/profile/update',
  async ({ id, updateData }, thunkAPI) => {
    try {
      const response = await userAPI.updateProfileById(id, updateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to update user'
      );
    }
  }
);
