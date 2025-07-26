import { createSlice } from '@reduxjs/toolkit';
import { UserState } from './userTypes';
import { fetchUsers, createUser, fetchUserById, updateUser, deleteUser, fetchProfile } from './userThunks';



const initialState: UserState = {
  users: [],
  profile: null,
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to fetch users';
      })

      // createUser
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to create user';
      })

      // fetchUserById
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const existingUserIndex = state.users.findIndex(user => user.id === action.payload.id);
        if (existingUserIndex >= 0) {
          state.users[existingUserIndex] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update user';
      })

      // updateUser
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const existingUserIndex = state.users.findIndex(user => user.id === action.payload.id);
        if (existingUserIndex >= 0) {
          state.users[existingUserIndex] = action.payload;
        } else {
          state.users.push(action.payload);
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to update user';
      })

      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to delete user';
      })

      // fetchProfileById
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to update user';
      })
      
  },
});

export default userSlice.reducer;
