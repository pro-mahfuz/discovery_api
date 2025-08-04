// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../modules/auth/features/authSlice";
import businessReducer from "../modules/business/features/businessSlice";
import userReducer from "../modules/user/features/userSlice";
import permissionReducer from "../modules/permission/features/permissionSlice";
import roleReducer from "../modules/role/features/roleSlice";
import partyReducer from "../modules/party/features/partySlice";
import categoryReducer from "../modules/category/features/categorySlice";
import itemReducer from "../modules/item/features/itemSlice";
import containerReducer from "../modules/container/features/containerSlice";
import invoiceReducer from "../modules/invoice/features/invoiceSlice";
import paymentReducer from "../modules/payment/features/paymentSlice";
import ledgerReducer from "../modules/ledger/features/ledgerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    business: businessReducer,
    permission: permissionReducer,
    role: roleReducer,
    party: partyReducer,
    category: categoryReducer,
    item: itemReducer,
    container: containerReducer,
    invoice: invoiceReducer,
    ledger: ledgerReducer,
    payment: paymentReducer,
    // other slices...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;