import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

export const fetchAllFilteredProducts = createAsyncThunk(
  "shopProducts/fetchAll",
  async ({ filterParams = {}, sortParams = "" } = {}) => {
    const query = new URLSearchParams({ ...filterParams, sortBy: sortParams });
    const res = await api.get(`/shop/products/get?${query.toString()}`);
    return res.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "shopProducts/fetchDetails",
  async (id) => {
    const res = await api.get(`/shop/products/get/${id}`);
    return res.data;
  }
);

const shopProductsSlice = createSlice({
  name: "shopProducts",
  initialState: {
    productList: [],
    productDetails: null,
    isLoading: false,
  },
  reducers: {
    clearProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || [];
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.productDetails = action.payload.data;
      });
  },
});

export const { clearProductDetails } = shopProductsSlice.actions;
export default shopProductsSlice.reducer;
