import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { articleAsyncThunk } from 'store/asyncThunk/articleAsyncThunk';
import { WikiApiResponse, WikiArticle } from 'types';

type InitialStateType = {
  pages:
    | {
        [key: string]: WikiArticle;
      }
    | {};
  data: WikiArticle[];
  loading: boolean;
  error: null | string | unknown;
};

const initialState: InitialStateType = {
  pages: {},
  data: [],
  loading: false,
  error: null,
};

const articleSlice = createSlice({
  name: 'articleSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(articleAsyncThunk.pending, (state, _) => {
        state.loading = true;
        state.error = null;
        state.pages = {};
      })
      .addCase(
        articleAsyncThunk.fulfilled,
        (state, { payload }: PayloadAction<WikiApiResponse>) => {
          state.loading = false;
          state.error = null;

          state.pages = payload.query?.pages || {};

          const filteredBatch = Object.values(state.pages).filter(
            (article) => article.thumbnail && article.thumbnail.source
          );

          state.data = [...state.data, ...filteredBatch];
        }
      )
      .addCase(articleAsyncThunk.rejected, (state, { payload }: PayloadAction<unknown>) => {
        state.loading = false;
        state.error = payload;
        state.pages = {};
      });
  },
});

export default articleSlice.reducer;
