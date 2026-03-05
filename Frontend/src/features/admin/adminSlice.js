import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const adminLogin = createAsyncThunk(
  "admin/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:9000/api/admin/login",
        formData
      );

      localStorage.setItem("adminToken", response.data.token);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    adminInfo: null,
    token: localStorage.getItem("adminToken") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logoutAdmin: (state) => {
      state.adminInfo = null;
      state.token = null;
      localStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminInfo = action.payload.admin;
        state.token = action.payload.token;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;