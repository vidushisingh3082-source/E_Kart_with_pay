import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

export const addReview = createAsyncThunk("review/add", async (reviewData) => {
  const res = await api.post("/shop/review/add", reviewData);
  return res.data;
});

export const getReviews = createAsyncThunk("review/get", async (productId) => {
  const res = await api.get(`/shop/review/${productId}`);
  return res.data;
});

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getReviews.fulfilled, (state, action) => {
      state.reviews = action.payload.data || [];
    });
  },
});

export default reviewSlice.reducer;
