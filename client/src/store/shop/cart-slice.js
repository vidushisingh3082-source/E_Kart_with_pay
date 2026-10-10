import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ userId, productId, size, quantity }) => {
    const res = await api.post("/shop/cart/add", { userId, productId, size, quantity });
    return res.data;
  }
);

export const fetchCartItems = createAsyncThunk("cart/fetch", async (userId) => {
  const res = await api.get(`/shop/cart/get/${userId}`);
  return res.data;
});

export const updateCartQuantity = createAsyncThunk(
  "cart/update",
  async ({ userId, productId, size, quantity }) => {
    const res = await api.put("/shop/cart/update", { userId, productId, size, quantity });
    return res.data;
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/delete",
  async ({ userId, productId, size }) => {
    const res = await api.delete(`/shop/cart/${userId}/${productId}?size=${encodeURIComponent(size)}`);
    return res.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addMatcher(
        (action) =>
          [addToCart.fulfilled, fetchCartItems.fulfilled, updateCartQuantity.fulfilled, deleteCartItem.fulfilled].some(
            (t) => t.type === action.type
          ),
        (state, action) => {
          state.isLoading = false;
          state.cartItems = action.payload.data?.items || [];
        }
      );
  },
});

export default cartSlice.reducer;
