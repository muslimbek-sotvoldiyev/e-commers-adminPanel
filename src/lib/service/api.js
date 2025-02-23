import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// FormData tekshiruvi
const isFormData = (body) => {
  return body instanceof FormData;
};

// API slice
const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/",
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      // FormData bo'lmasa, Content-Type JSON qilib qo'yiladi
      const state = getState();
      if (!isFormData(state?.arg)) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  }),
  tagTypes: ["Users", "Categories", "Products", "Wishlist", "Cart", "Orders", "CardInfo"], // Taglarni kengaytiramiz
  endpoints: (builder) => ({
    // Categories
    getCategories: builder.query({
      query: () => `categories/`,
      providesTags: ["Categories"],
    }),
    getCategoriesId: builder.query({
      query: ({ id }) => `categories/${id}/`,
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/categories",
        method: "POST",
        body: newCategory,
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),

    // Products
    getProducts: builder.query({
      query: () => `products`,
      providesTags: ["Products"],
    }),
    getProductId: builder.query({
      query: ({ id }) => `products/${id}/`,
      providesTags: ["Products"],
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

    // Wishlist
    getWishlist: builder.query({
      query: () => "wishlist",
      providesTags: ["Wishlist"],
    }),
    toggleWishlist: builder.mutation({
      query: (productId) => ({
        url: `wishlist/toggle/${productId}`,
        method: "POST",
      }),
      invalidatesTags: ["Wishlist"],
    }),
    deleteWishlist: builder.mutation({
      query: (productId) => ({
        url: `wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
    clearWishlist: builder.mutation({
      query: () => ({
        url: `wishlist/clear`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    // Cart
    getCartItem: builder.query({
      query: () => `cart-item`,
      providesTags: ["Cart"],
    }),
    AddCartItem: builder.mutation({
      query: (data) => ({
        url: `/cart-item/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ id, quantity }) => ({
        url: `cart-item/${id}`,
        method: "PUT",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    deleteCartItem: builder.mutation({
      query: ({ id }) => ({
        url: `cart-item/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    // Orders
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["Orders"],
    }),
    GetOrder: builder.query({
      query: () => `order`,
      providesTags: ["Orders"],
    }),

    // Card Info
    getCardInfo: builder.query({
      query: () => `card-info/user`,
      providesTags: ["CardInfo"],
    }),
    addCard: builder.mutation({
      query: (orderData) => ({
        url: "/card-info",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["CardInfo"],
    }),
    DeleteCard: builder.mutation({
      query: ({ id }) => ({
        url: `card-info/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CardInfo"],
    }),

    // User (Mavjud)
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

    // Yangi User Endpointlari (registersiz)
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

    // Search
    searchProducts: builder.query({
      query: (searchTerm) =>
        `products/search?query=${encodeURIComponent(searchTerm)}`,
      providesTags: ["Products"],
    }),
  }),
});

// Eksport qilinadigan hooklar
export const {
  // Categories
  useGetCategoriesQuery,
  useGetCategoriesIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  // Products
  useGetProductsQuery,
  useGetProductIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,

  // Wishlist
  useGetWishlistQuery,
  useToggleWishlistMutation,
  useDeleteWishlistMutation,
  useClearWishlistMutation,

  // Cart
  useGetCartItemQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,

  // Orders
  useCreateOrderMutation,
  useGetOrderQuery,

  // Card Info
  useGetCardInfoQuery,
  useAddCardMutation,
  useDeleteCardMutation,

  // User (Mavjud)
  useGetMeQuery,
  useUpdateMeMutation,

  // Yangi User Hooklari
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,

  // Auth
  useRefreshTokenMutation,

  // Search
  useSearchProductsQuery,
} = api;

export default api;

