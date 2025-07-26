// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../modules/auth/features/authSlice";
import userReducer from "../modules/user/features/userSlice";
import permissionReducer from "../modules/permission/features/permissionSlice";
import roleReducer from "../modules/role/features/roleSlice";
import partyReducer from "../modules/party/features/partySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    permission: permissionReducer,
    role: roleReducer,
    party: partyReducer,
    // other slices...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;