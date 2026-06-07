import { createAsyncThunk } from "@reduxjs/toolkit";
import { AXIOS } from "api/AXIOS";

// Quick type matching your global state architecture
interface RootState {
  article: {
    lang: "ar" | "en" | "fr";
  };
}

export const articleAsyncThunk = createAsyncThunk(
  'article/fetch',
  async (params: any, { getState, rejectWithValue }) => {
    try {
      const { isRefresh, ...apiParams } = params;
      
      // Safe, dynamic store extraction without circular reference loops
      const state = getState() as RootState;
      const currentLang = state.article?.lang || "ar";
      
      // Pass 'lang' inside the Axios request configuration object
      const response = await AXIOS.get('/w/api.php', { 
        params: apiParams,
        lang: currentLang // Sent safely to your interceptor rule
      });
      return { ...response.data, isRefresh }; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error?.info || err.message);
    }
  }
);