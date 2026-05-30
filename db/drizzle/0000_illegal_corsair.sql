CREATE TABLE `bookmarks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`source` text NOT NULL,
	`created_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bookmarks_title_unique` ON `bookmarks` (`title`);