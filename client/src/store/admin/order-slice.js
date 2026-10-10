import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

export const getAllOrdersForAdmin = createAsyncThunk("adminOrder/fetchAll", async () => {
  const res = await api.get("/admin/orders/get");
  return res.data;
});

export const getOrderDetailsForAdmin = createAsyncThunk("adminOrder/fetchDetails", async (id) => {
  const res = await api.get(`/admin/orders/details/${id}`);
  return res.data;
});

export const updateOrderStatus = createAsyncThunk(
  "adminOrder/updateStatus",
  async ({ id, orderStatus }) => {
    const res = await api.put(`/admin/orders/update/${id}`, { orderStatus });
    return res.data;
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState: {
    orderList: [],
    orderDetails: null,
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || [];
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.orderDetails = action.payload.data;
      });
  },
});

export default adminOrderSlice.reducer;
