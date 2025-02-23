import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authlice";
import api from "./service/api";
import AuthApi from "./service/authApi";
import productcrudAPi from "./service/productcrud";

const store = configureStore({
  reducer: {
    auth: authSlice,
    [api.reducerPath]: api.reducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [productcrudAPi.reducerPath]: productcrudAPi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      api.middleware,
      AuthApi.middleware,
      productcrudAPi.middleware
    ),
});

export default store;
