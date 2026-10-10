import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

export const addProduct = createAsyncThunk("adminProducts/add", async (formData) => {
  const res = await api.post("/admin/products/add", formData);
  return res.data;
});

export const editProduct = createAsyncThunk(
  "adminProducts/edit",
  async ({ id, formData }) => {
    const res = await api.put(`/admin/products/edit/${id}`, formData);
    return res.data;
  }
);

export const deleteProduct = createAsyncThunk("adminProducts/delete", async (id) => {
  const res = await api.delete(`/admin/products/delete/${id}`);
  return { ...res.data, id };
});

export const fetchAllProducts = createAsyncThunk("adminProducts/fetchAll", async () => {
  const res = await api.get("/admin/products/get");
  return res.data;
});

const adminProductsSlice = createSlice({
  name: "adminProducts",
  initialState: {
    productList: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data || [];
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.productList = state.productList.filter((p) => p._id !== action.payload.id);
      });
  },
});

export default adminProductsSlice.reducer;
