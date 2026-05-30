import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const bookmarksTable = sqliteTable('bookmarks', {
  id: text('id').primaryKey(), // Using text for UUID hashes
  title: text('title').notNull().unique(),
  description: text('description').notNull(),
  source: text('source').notNull(), // Stores image asset references or URLs
  createdAt: text('created_at').$defaultFn(() => new Date().toISOString()),
});

export type Bookmark = typeof bookmarksTable.$inferSelect;
export type NewBookmark = typeof bookmarksTable.$inferInsert;