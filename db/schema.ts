import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const bookmarksTable = sqliteTable('bookmarks', {
  id: text('id').primaryKey(), // Using text for UUID hashes
  title: text('title').notNull(), // Removed .unique() to allow same topic in multiple languages
  description: text('description').notNull(), // Article extract or preview text
  source: text('source').notNull(), // Stores image asset references or URLs
  lang: text('lang').notNull().$default(() => 'en'), // "en" | "ar" | "fr"
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

export type Bookmark = typeof bookmarksTable.$inferSelect;
export type NewBookmark = typeof bookmarksTable.$inferInsert;