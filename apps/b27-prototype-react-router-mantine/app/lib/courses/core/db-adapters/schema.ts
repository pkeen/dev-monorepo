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
		description: text("description"),
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
	description: text("description"),
	isPublished: boolean("is_published").notNull().default(false),
});

export const courseSlot = courses.table(
	"course_slot",
	{
		id: serial("id").primaryKey(),
		courseId: integer("course_id")
			.notNull()
			.references(() => course.id),
		moduleId: integer("module_id").references(() => module.id),
		lessonId: integer("lesson_id").references(() => lesson.id),
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
		.references(() => module.id),
	lessonId: integer("lesson_id")
		.notNull()
		.references(() => lesson.id),
});
