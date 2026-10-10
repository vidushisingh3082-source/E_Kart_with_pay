import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

export const createNewOrder = createAsyncThunk("order/create", async (orderData) => {
  const res = await api.post("/shop/order/create", orderData);
  return res.data;
});

export const verifyPayment = createAsyncThunk("order/verify", async (data) => {
  const res = await api.post("/shop/order/verify", data);
  return res.data;
});

export const fetchAllOrdersByUser = createAsyncThunk("order/fetchAllByUser", async (userId) => {
  const res = await api.get(`/shop/order/list/${userId}`);
  return res.data;
});

export const fetchOrderDetails = createAsyncThunk("order/fetchDetails", async (id) => {
  const res = await api.get(`/shop/order/details/${id}`);
  return res.data;
});

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orderList: [],
    orderDetails: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrdersByUser.fulfilled, (state, action) => {
        state.orderList = action.payload.data || [];
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.orderDetails = action.payload.data;
      });
  },
});

export default orderSlice.reducer;
