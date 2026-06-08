import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { db } from 'db';
import { Bookmark, bookmarksTable } from 'db/schema';
import { eq } from 'drizzle-orm';
import * as Crypto from 'expo-crypto';

interface BookmarkState {
  items: Bookmark[];
  loading: boolean;
  error: string | null;
}

const initialState: BookmarkState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchBookmarksAsync = createAsyncThunk(
  'bookmark/fetchBookmarks',
  async (_, { rejectWithValue }) => {
    try {
      const results = await db.select().from(bookmarksTable);
      return results;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch bookmarks');
    }
  }
);

// Accept language context variable fields dynamically on creation
export const addBookmarkAsync = createAsyncThunk(
  'bookmark/addBookmark',
  async (article: { title: string; description: string; source: string; lang: "ar" | "en" | "fr" }, { rejectWithValue }) => {
    try {
      const newBookmark: Bookmark = {
        id: Crypto.randomUUID(),
        title: article.title,
        description: article.description ,
        source: article.source,
        lang: article.lang, // Persisted explicitly to DB schema row
        createdAt: new Date().toISOString(),
      };

      await db.insert(bookmarksTable).values(newBookmark);
      return newBookmark;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to save bookmark');
    }
  }
);

export const removeBookmarkByTitleAsync = createAsyncThunk(
  'bookmark/removeBookmarkByTitle',
  async (title: string, { rejectWithValue }) => {
    try {
      await db.delete(bookmarksTable).where(eq(bookmarksTable.title, title));
      return title;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete bookmark');
    }
  }
);

export const removeBookmarkAsync = createAsyncThunk(
  'bookmark/removeBookmark',
  async (id: string, { rejectWithValue }) => {
    try {
      await db.delete(bookmarksTable).where(eq(bookmarksTable.id, id));
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to delete bookmark');
    }
  }
);

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarksAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBookmarksAsync.fulfilled, (state, action: PayloadAction<Bookmark[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBookmarksAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addBookmarkAsync.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload]; 
      })
      .addCase(removeBookmarkAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(removeBookmarkByTitleAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.title !== action.payload);
      });
  },
});

export default bookmarkSlice.reducer;