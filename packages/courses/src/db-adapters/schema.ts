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
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// // Enums must be exported to be created in SQL
// export const publishedStatusEnum = pgEnum("published_status", [
// 	"draft",
// 	"published",
// ]);

export const courses = pgSchema("courses");

export const course = courses.table(
	"course",
	{
		id: serial("id").primaryKey(),
		userId: uuid("user_id").notNull(), // references external foreign key from auth
		title: varchar("title", { length: 256 }).notNull(),
		description: text("description").notNull(),
		isPublished: boolean("is_published").notNull().default(false),
	},
	(table) => ({
		userIdIdx: index("course_user_id_idx").on(table.userId),
	})
);

export const module = courses.table("module", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 256 }).notNull(),
	description: text("description"),
	isPublished: boolean("is_published").notNull().default(false),
});

export const lesson = courses.table("lesson", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 256 }).notNull(),
	isPublished: boolean("is_published").notNull().default(false),
	excerpt: text("excerpt"),
	content: text("content"),
});

export const courseSlot = courses.table(
	"course_slot",
	{
		id: serial("id").primaryKey(),
		courseId: integer("course_id")
			.notNull()
			.references(() => course.id),
		moduleId: integer("module_id").references(() => module.id, {
			onDelete: "cascade",
		}),
		lessonId: integer("lesson_id").references(() => lesson.id, {
			onDelete: "cascade",
		}),
		order: integer("order").notNull(), // NEW
	},
	(table) => ({
		moduleOrLesson: sql`check (
        (module_id IS NULL AND lesson_id IS NOT NULL) OR 
        (module_id IS NOT NULL AND lesson_id IS NULL)
    )`,
		// Add indexes for foreign keys
		courseIdx: index("course_slot_course_id_idx").on(table.courseId),
		moduleIdx: index("course_slot_module_id_idx").on(table.moduleId),
		lessonIdx: index("course_slot_lesson_id_idx").on(table.lessonId),
	})
);

export const moduleSlot = courses.table("module_slot", {
	id: serial("id").primaryKey(),
	moduleId: integer("module_id")
		.notNull()
		.references(() => module.id, { onDelete: "cascade" }),
	lessonId: integer("lesson_id")
		.notNull()
		.references(() => lesson.id, { onDelete: "cascade" }),
	order: integer("order").notNull(), // NEW
});

export const createSchema = () => {
	const video = courses.table("video", {
		id: serial("id").primaryKey(),
		provider: varchar("provider", { length: 256 }).notNull(),
		url: text("url").notNull(),
		title: varchar("title", { length: 256 }).notNull(),
		thumbnailUrl: text("thumbnail_url").notNull(),
		isPublished: boolean("is_published").notNull().default(false),
		order: integer("order").notNull(), // NEW
		// durationSeconds: integer("duration_seconds").notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	});

	return {
		courses: pgSchema("courses"),
		course: courses.table(
			"course",
			{
				id: serial("id").primaryKey(),
				userId: uuid("user_id").notNull(), // references external foreign key from auth
				title: varchar("title", { length: 256 }).notNull(),
				description: text("description").notNull(),
				isPublished: boolean("is_published").notNull().default(false),
			},
			(table) => ({
				userIdIdx: index("course_user_id_idx").on(table.userId),
			})
		),
		module: courses.table("module", {
			id: serial("id").primaryKey(),
			name: varchar("name", { length: 256 }).notNull(),
			description: text("description"),
			isPublished: boolean("is_published").notNull().default(false),
		}),
		video,
		lesson: courses.table("lesson", {
			id: serial("id").primaryKey(),
			name: varchar("name", { length: 256 }).notNull(),
			// description: text("description"),
			excerpt: text("excerpt"), // short summary for previews
			content: text("content"), // raw markdown or HTML
			isPublished: boolean("is_published").notNull().default(false),
			videoId: integer("video_id").references(() => video.id, {
				onDelete: "cascade",
			}),
		}),
		courseSlot: courses.table(
			"course_slot",
			{
				id: serial("id").primaryKey(),
				courseId: integer("course_id")
					.notNull()
					.references(() => course.id, { onDelete: "cascade" }),
				moduleId: integer("module_id").references(() => module.id, {
					onDelete: "cascade",
				}),
				lessonId: integer("lesson_id").references(() => lesson.id, {
					onDelete: "cascade",
				}),
				order: integer("order").notNull(), // NEW
			},
			(table) => ({
				moduleOrLesson: sql`check (
                (module_id IS NULL AND lesson_id IS NOT NULL) OR 
        (module_id IS NOT NULL AND lesson_id IS NULL)
        )`,
				// Add indexes for foreign keys
				courseIdx: index("course_slot_course_id_idx").on(
					table.courseId
				),
				moduleIdx: index("course_slot_module_id_idx").on(
					table.moduleId
				),
				lessonIdx: index("course_slot_lesson_id_idx").on(
					table.lessonId
				),
			})
		),
		moduleSlot: courses.table("module_slot", {
			id: serial("id").primaryKey(),
			moduleId: integer("module_id")
				.notNull()
				.references(() => module.id, { onDelete: "cascade" }),
			lessonId: integer("lesson_id")
				.notNull()
				.references(() => lesson.id, { onDelete: "cascade" }),
			order: integer("order").notNull(), // NEW
		}),
	};
};
