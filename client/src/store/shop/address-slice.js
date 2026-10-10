import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

export const addAddress = createAsyncThunk("address/add", async (formData) => {
  const res = await api.post("/shop/address/add", formData);
  return res.data;
});

export const fetchAllAddresses = createAsyncThunk("address/fetchAll", async (userId) => {
  const res = await api.get(`/shop/address/get/${userId}`);
  return res.data;
});

export const editAddress = createAsyncThunk(
  "address/edit",
  async ({ userId, addressId, formData }) => {
    const res = await api.put(`/shop/address/update/${userId}/${addressId}`, formData);
    return res.data;
  }
);

export const deleteAddress = createAsyncThunk(
  "address/delete",
  async ({ userId, addressId }) => {
    const res = await api.delete(`/shop/address/delete/${userId}/${addressId}`);
    return { ...res.data, addressId };
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addressList: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data || [];
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addressList = state.addressList.filter((a) => a._id !== action.payload.addressId);
      });
  },
});

export default addressSlice.reducer;
