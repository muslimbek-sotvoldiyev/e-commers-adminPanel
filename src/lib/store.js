import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authlice";
import api from "./service/api";
import AuthApi from "./service/authApi";

const store = configureStore({
  reducer: {
    auth: authSlice,
    [api.reducerPath]: api.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, AuthApi.middleware),
});

export default store;
