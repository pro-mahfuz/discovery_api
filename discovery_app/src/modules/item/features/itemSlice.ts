import { createSlice } from '@reduxjs/toolkit';
import { ItemState } from './itemTypes';
import { create, fetchAllItem, fetchById, update, destroy } from './itemThunks';



const initialState: ItemState = {
  data: [],
  status: 'idle',
  error: null,
};

const Slice = createSlice({
  name: 'item',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchParty
      .addCase(fetchAllItem.pending, (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addCase(fetchAllItem.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.data = action.payload;
          //console.log("action.payload: ", action.payload);
      })
      .addCase(fetchAllItem.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message || null;
      })

      // createParty
      .addCase(create.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.push(action.payload);
      })
      .addCase(create.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // fetchUserById
      .addCase(fetchById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const existingIndex = state.data.findIndex(d => d.id === action.payload.id);
        if (existingIndex >= 0) {
          state.data[existingIndex] = action.payload;
        } else {
          state.data.push(action.payload);
        }
      })
      .addCase(fetchById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // updateUser
      .addCase(update.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const existingUserIndex = state.data.findIndex(d => d.id === action.payload.id);
        if (existingUserIndex >= 0) {
          state.data[existingUserIndex] = action.payload;
        } else {
          state.data.push(action.payload);
        }
      })
      .addCase(update.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // deleteUser
      .addCase(destroy.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = state.data.filter(d => d.id !== action.payload);
      })
      .addCase(destroy.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      
  },
});

export default Slice.reducer;
