import type { Course, CourseInput, ModuleCRUD } from "./types";
import { DrizzlePGAdapter, DBAdapter } from "./db-adapters/drizzle-pg";
// import db from "~/lib/db/index.server";
// import * as schema from "~/lib/courses/db/schema";

export interface CourseManager {
	create: (input: CourseInput) => Promise<Course>;
	update: (id: string, input: Partial<CourseInput>) => Promise<Course>;
	delete: (id: string) => Promise<void>;
	list: () => Promise<Course[]>;
	getCourse: (id: string) => Promise<Course | null>;
	module: ModuleCRUD;
}

// const dbAdapter = DrizzlePGAdapter(db);

export const CourseManager = (dbAdapter: DBAdapter) => {
	return {
		create: async (input: CourseInput) => {
			return dbAdapter.createCourse(input);
		},
		getCourse: async (id: string) => {
			return dbAdapter.getCourse(id);
		},
		update: async (id: string, input: Partial<CourseInput>) => {
			return dbAdapter.updateCourse(id, input);
		},
		delete: async (id: string) => {
			return dbAdapter.deleteCourse(id);
		},
		list: async () => {
			return dbAdapter.listCourses();
		},
		module: dbAdapter.module,
	};
};
