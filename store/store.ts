import { configureStore } from '@reduxjs/toolkit';
import articleSlice from './slices/articleSlice';
import bookmarkSlice from './slices/bookmarksSlice';
export const store = configureStore({
  reducer: {
    article: articleSlice,
    bookmark: bookmarkSlice,
  },
});

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
