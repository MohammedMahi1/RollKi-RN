import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { articleAsyncThunk } from 'store/asyncThunk/articleAsyncThunk';
import { WikiApiResponse, WikiArticle } from 'types';

type LangType = "ar" | "en" | "fr";

type InitialStateType = {
  pages: { [key: string]: WikiArticle } | {};
  data: WikiArticle[];
  loading: boolean;
  error: null | string | unknown;
  lang: LangType;
};

const initialState: InitialStateType = {
  pages: {},
  data: [],
  loading: false,
  error: null,
  lang: "ar"
};

const articleSlice = createSlice({
  name: 'articleSlice',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LangType>) => {
      state.lang = action.payload;
      state.data = [];   // Flushes out previous language data streams
      state.pages = {};  
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(articleAsyncThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        articleAsyncThunk.fulfilled,
        (state, action: PayloadAction<WikiApiResponse & { isRefresh?: boolean }>) => {
          state.loading = false;
          state.error = null;
          state.pages = action.payload.query?.pages || {};

          const filteredBatch = Object.values(state.pages).filter(
            (article) => article.thumbnail && article.thumbnail.source
          );

          if (action.payload.isRefresh) {
            state.data = filteredBatch; 
          } else {
            state.data = [...state.data, ...filteredBatch];
          }
        }
      )
      .addCase(articleAsyncThunk.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.pages = {};
      });
  },
});

export const { setLanguage } = articleSlice.actions;
export default articleSlice.reducer;