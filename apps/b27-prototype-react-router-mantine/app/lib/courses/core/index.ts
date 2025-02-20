import type { Course, CourseInput, UpdateCourseInput } from "./index.types";
import { DrizzlePGAdapter } from "./db-adapters/drizzle-pg";
import db from "~/lib/db";
import * as schema from "~/lib/courses/db/schema";

export interface CourseManager {
	create: (input: CourseInput) => Promise<Course>;
	update: (id: string, input: Partial<CourseInput>) => Promise<Course>;
	delete: (id: string) => Promise<void>;
	list: () => Promise<Course[]>;
	getCourse: (id: string) => Promise<Course | null>;
}

const dbAdapter = DrizzlePGAdapter(db);

export const CourseManager = () => {
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
	};
};
