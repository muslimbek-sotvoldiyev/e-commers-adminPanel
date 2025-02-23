import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const AuthApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "users/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation({
      query: (formData) => ({
        url: "users/register/",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),

    tokenVerify: builder.mutation({
      query: (token) => ({
        url: "/token/verify/",
        method: "POST",
        body: { token },
      }),
    }),
    refreshToken: builder.mutation({
      query: (refresh) => ({
        url: "users/refresh/",
        method: "POST",
        body: { refresh },
      }),
    }),
  }),
});

export const {
  useTokenVerifyMutation,
  useRefreshTokenMutation,
  useLoginMutation,
  useRegisterMutation,
} = AuthApi;

export default AuthApi;
