// import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgDatabase, type PgQueryResultHKT } from "drizzle-orm/pg-core";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as defaultSchema from "./schema";
import type { CourseInput, Course } from "../types";
import { eq } from "drizzle-orm";

type DefaultSchema = typeof defaultSchema;

type DrizzleDatabase =
	// | NodePgDatabase
	PgDatabase<PgQueryResultHKT, any> | NeonHttpDatabase;

const toDBId = (id: string): number => parseInt(id, 10);

// what type is this?
export const DrizzlePGAdapter = (
	db: DrizzleDatabase,
	schema: DefaultSchema = defaultSchema
) => {
	return {
		createCourse: async (input: CourseInput): Promise<Course> => {
			const [course] = await db
				.insert(schema.course)
				.values(input)
				.returning();
			return course;
		},
		getCourse: async (id: string) => {
			const [course] = await db
				.select()
				.from(schema.course)
				.where(eq(schema.course.id, toDBId(id)));
			return course;
		},
		updateCourse: async (
			id: string,
			data: Partial<CourseInput>
		): Promise<Course> => {
			const [course] = await db
				.update(schema.course)
				.set(data)
				.where(eq(schema.course.id, toDBId(id)))
				.returning();
			return course;
		},
		deleteCourse: async (id: string): Promise<void> => {
			await db
				.delete(schema.course)
				.where(eq(schema.course.id, toDBId(id)));
		},
		logSchema: () => {
			console.log(schema);
		},
		listCourses: async () => {
			return db.select().from(schema.course);
		},
	};
};

export const createCoursesDBAdapter = (db: DrizzleDatabase) => {
	return {
		adapter: DrizzlePGAdapter(db),
		schema: defaultSchema.createSchema(),
	};
};

export interface DBAdapter {
	createCourse: (input: CourseInput) => Promise<Course>;
	getCourse: (id: string) => Promise<Course | null>;
	updateCourse: (id: string, data: Partial<CourseInput>) => Promise<Course>;
	deleteCourse: (id: string) => Promise<void>;
	logSchema: () => void;
	listCourses: () => Promise<Course[]>;
}
