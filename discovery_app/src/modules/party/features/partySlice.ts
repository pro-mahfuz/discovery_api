import { createSlice } from '@reduxjs/toolkit';
import { PartyState } from './partyTypes';
import { createParty, fetchParty, fetchPartyById, updateParty, deleteParty } from './partyThunks';



const initialState: PartyState = {
  parties: [],
  suppliers: [],
  customers: [],
  status: 'idle',
  error: null,
};

const partySlice = createSlice({
  name: 'party',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchParty
      .addCase(fetchParty.pending, (state) => {
          state.status = 'loading';
          state.error = null;
      })
      .addCase(fetchParty.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.parties = action.payload;
      })
      .addCase(fetchParty.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload || action.error.message || 'Failed to fetch party';
      })

      // createParty
      .addCase(createParty.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.parties.push(action.payload);
      })
      .addCase(createParty.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to create user';
      })

      // fetchUserById
      .addCase(fetchPartyById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPartyById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const existingIndex = state.parties.findIndex(party => party.id === action.payload.id);
        if (existingIndex >= 0) {
          state.parties[existingIndex] = action.payload;
        } else {
          state.parties.push(action.payload);
        }
      })
      .addCase(fetchPartyById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update party';
      })

      // updateUser
      .addCase(updateParty.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const existingUserIndex = state.parties.findIndex(party => party.id === action.payload.id);
        if (existingUserIndex >= 0) {
          state.parties[existingUserIndex] = action.payload;
        } else {
          state.parties.push(action.payload);
        }
      })
      .addCase(updateParty.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to update party';
      })

      // deleteUser
      .addCase(deleteParty.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.parties = state.parties.filter(party => party.id !== action.payload);
      })
      .addCase(deleteParty.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message || 'Failed to delete party';
      })

      
  },
});

export default partySlice.reducer;
