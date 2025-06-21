import { sql } from "drizzle-orm";
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
import { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";

export type DrizzleDatabase =
	| PgDatabase<PgQueryResultHKT, any>
	| NeonHttpDatabase;

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

// TODO: Work this out
/** Call this exactly once after you create the tables.
 *  After that the trigger lives in the database.
 */
export async function initCourseSchema(db: DrizzleDatabase) {
	await db.execute(sql`
    DO $$
    BEGIN
      /* install trigger func once per DB */
      IF NOT EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'trg_course_node_no_cycles'
      ) THEN

        CREATE OR REPLACE FUNCTION trg_course_node_no_cycles()
        RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
          /* root nodes are always fine */
          IF NEW.parent_id IS NULL THEN
            RETURN NEW;
          END IF;

          /* parent must belong to the same course */
          IF NEW.course_id <> (
               SELECT course_id FROM course_node WHERE id = NEW.parent_id
             )
          THEN
            RAISE EXCEPTION USING
              ERRCODE = '23514',          -- check_violation
              MESSAGE = format(
                'Parent node % belongs to a different course', NEW.parent_id
              );
          END IF;

          /* prevent cycles: is New.parent one of my descendants? */
          IF EXISTS (
            WITH RECURSIVE anc(id) AS (
              SELECT NEW.parent_id
              UNION ALL
              SELECT parent_id
              FROM course_node
              WHERE id = anc.id
                AND parent_id IS NOT NULL
            )
            SELECT 1 FROM anc WHERE id = NEW.id
          ) THEN
            RAISE EXCEPTION USING
              ERRCODE = '23514',
              MESSAGE = 'Cycle detected: node cannot be its own ancestor';
          END IF;

          RETURN NEW;
        END $$;

        CREATE TRIGGER course_node_no_cycles
        BEFORE INSERT OR UPDATE ON course_node
        FOR EACH ROW EXECUTE FUNCTION trg_course_node_no_cycles();

      END IF;
    END $$;
  `);
}
