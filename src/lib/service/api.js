import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const isFormData = (body) => {
  return body instanceof FormData;
};

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://e-commers-bakend-production.up.railway.app/",
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      const state = getState();
      if (!isFormData(state?.arg)) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => `categories/`,
    }),
    getCategoriesId: builder.query({
      query: ({ id }) => `categories/${id}/`,
    }),
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/categories",
        method: "POST",
        body: newCategory,
      }),
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: patch,
      }),
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
    }),

    getProducts: builder.query({
      query: () => `products`,
    }),
    getProductId: builder.query({
      query: ({ id }) => `products/${id}/`,
    }),
    createProduct: builder.mutation({
      query: (formData) => ({
        url: "/products",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),

    getMe: builder.query({
      query: () => `users/mee`,
      providesTags: ["Users"],
    }),
    updateMe: builder.mutation({
      query: (userData) => ({
        url: "users",
        method: "PATCH",
        body: userData,
      }),
    }),

    getUsers: builder.query({
      query: () => "users",
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: (user) => ({
        url: `users/${user.id}`,
        method: "PUT",
        body: user,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
    }),

    RefreshToken: builder.mutation({
      query: (orderData) => ({
        url: "/refresh",
        method: "POST",
        body: orderData,
      }),
    }),

    searchProducts: builder.query({
      query: (searchTerm) =>
        `products/search?query=${encodeURIComponent(searchTerm)}`,
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoriesIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  useGetProductsQuery,
  useGetProductIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,

  useGetMeQuery,
  useUpdateMeMutation,

  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,

  useRefreshTokenMutation,

  useSearchProductsQuery,
} = api;

export default api;
