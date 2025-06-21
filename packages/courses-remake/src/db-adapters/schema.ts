import {
	pgTable,
	integer,
	pgSchema,
	text,
	varchar,
	boolean,
	pgEnum,
	index,
	serial,
	uuid,
	timestamp,
	PgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const courses = pgSchema("courses");

export const course = courses.table(
	"course",
	{
		id: serial("id").primaryKey(),
		userId: text("user_id").notNull(), // references external foreign key from auth
		title: varchar("title", { length: 256 }).notNull(),
		description: text("description").notNull(),
		isPublished: boolean("is_published").notNull().default(false),
	},
	(table) => ({
		userIdIdx: index("course_user_id_idx").on(table.userId),
	})
);

export const contentType = pgEnum("content_type", [
	"lesson",
	"quiz",
	"file",
	"module",
]);

export const contentItem = courses.table("content_item", {
	id: serial("id").primaryKey(),
	type: contentType("type").notNull(),
	title: text("title").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	// optional: current_version, etc.
});

// Hierarchy inside one course
export const courseNode = courses.table(
	"course_node",
	{
		id: serial("id").primaryKey(),
		courseId: integer("course_id").notNull(),
		parentId: integer("parent_id"), // self-ref
		order: integer("order").notNull(),

		contentId: integer("content_id")
			.references(() => contentItem.id)
			.notNull(),
	},
	(table) => ({
		courseParentIdx: index("course_parent_idx").on(
			table.courseId,
			table.parentId,
			table.order
		),
	})
);

export const videoProviderEnum = pgEnum("provider", [
	"r2",
	"youtube",
	"vimeo",
	"mux",
	"bunny",
]);

export const video = courses.table("video", {
	id: serial("id").primaryKey(),
	provider: videoProviderEnum("provider").notNull(),
	url: text("url").notNull(),
	title: varchar("title", { length: 256 }).notNull(),
	thumbnailUrl: text("thumbnail_url").notNull(),
	isPublished: boolean("is_published").notNull().default(false),
	order: integer("order").notNull(), // NEW
	// durationSeconds: integer("duration_seconds").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const lessonDetail = courses.table("lesson_detail", {
	id: serial("id").primaryKey(),
	contentItemId: integer("content_item_id").notNull(),
	videoId: integer("video_id").references(() => video.id, {
		onDelete: "cascade",
	}),
	excerpt: text("excerpt"), // short summary for previews
	bodyContent: text("body_content"), // raw markdown or HTML
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const createSchema = () => {
	return {
		courses,
		course,
		contentItem,
		courseNode,
		lessonDetail,
		videoProviderEnum,
		video,
	};
};
