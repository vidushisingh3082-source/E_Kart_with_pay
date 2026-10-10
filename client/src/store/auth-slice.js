import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axios";

export const registerUser = createAsyncThunk("auth/register", async (formData) => {
  const res = await api.post("/auth/register", formData);
  return res.data;
});

export const loginUser = createAsyncThunk("auth/login", async (formData) => {
  const res = await api.post("/auth/login", formData);
  return res.data;
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  const res = await api.post("/auth/logout");
  return res.data;
});

export const checkAuth = createAsyncThunk("auth/checkAuth", async () => {
  const res = await api.get("/auth/check-auth");
  return res.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    isLoading: true,
    user: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.success ? action.payload.user : null;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.success;
        state.user = action.payload.success ? action.payload.user : null;
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
