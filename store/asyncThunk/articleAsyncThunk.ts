import { createAsyncThunk } from "@reduxjs/toolkit";
import { AXIOS } from "api/AXIOS";

// Inside your store/asyncThunk/articleAsyncThunk file:
export const articleAsyncThunk = createAsyncThunk(
  'article/fetch',
  async (params: any, { rejectWithValue }) => {
    try {
      const { isRefresh, ...apiParams } = params;
      
      const response = await AXIOS.get('/w/api.php', { params: apiParams });
      
      return { ...response.data, isRefresh }; 
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);