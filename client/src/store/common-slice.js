import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

export const addFeatureImage = createAsyncThunk(
  "common/addFeature",
  async ({ image, type }) => {
    const res = await api.post("/common/feature/add", { image, type });
    return res.data;
  }
);

export const getFeatureImages = createAsyncThunk("common/getFeature", async (type) => {
  const res = await api.get("/common/feature/get", { params: type ? { type } : {} });
  return { type, ...res.data };
});

export const deleteFeatureImage = createAsyncThunk("common/deleteFeature", async (id) => {
  const res = await api.delete(`/common/feature/${id}`);
  return { id, ...res.data };
});

const commonSlice = createSlice({
  name: "common",
  initialState: {
    featureImageList: [],
    aboutUsImageList: [],
    contactUsImageList: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        const list = action.payload.data || [];
        if (action.payload.type === "about-us") state.aboutUsImageList = list;
        else if (action.payload.type === "contact-us") state.contactUsImageList = list;
        else state.featureImageList = list;
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        const { id } = action.payload;
        state.featureImageList = state.featureImageList.filter((f) => f._id !== id);
        state.aboutUsImageList = state.aboutUsImageList.filter((f) => f._id !== id);
        state.contactUsImageList = state.contactUsImageList.filter((f) => f._id !== id);
      });
  },
});

export default commonSlice.reducer;
