import type {
	Course,
	CreateCourseInput,
	UpdateCourseInput,
} from "./index.types";
import { DrizzlePGAdapter } from "./db-adapters/drizzle-pg";
import db from "~/lib/db";
import * as schema from "~/lib/courses/db/schema";
import { eq } from "drizzle-orm";

export interface CourseManager {
	create: (input: CreateCourseInput) => Promise<Course>;
	update: (input: UpdateCourseInput) => Promise<Course>;
	delete: (id: string) => Promise<void>;
	list: () => Promise<Course[]>;
	getCourse: (id: string) => Promise<Course | null>;
}

const dbAdapter = DrizzlePGAdapter(db);

export const CourseManager = () => {
	return {
		create: async (input: CreateCourseInput) => {
			return dbAdapter.createCourse(input);
		},
		getCourse: async (id: string) => {
			return dbAdapter.getCourse(id);
		},
		update: () => {},
		delete: () => {},
		list: async () => {
			return dbAdapter.listCourses();
		},
	};
};
