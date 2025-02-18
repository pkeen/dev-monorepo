import type {
	Course,
	CreateCourseInput,
	UpdateCourseInput,
} from "./index.types";
import db from "~/lib/db";
import * as schema from "~/lib/courses/db/schema";

export interface CourseManager {
	create: (input: CreateCourseInput) => Promise<Course>;
	update: (input: UpdateCourseInput) => Promise<Course>;
	delete: (id: string) => Promise<void>;
	list: () => Promise<Course[]>;
}

export const CourseManager = () => {
	return {
		create: async (input: CreateCourseInput) => {
			return db.insert(schema.course).values(input);
		},
		update: () => {},
		delete: () => {},
		list: async () => {
			return db.select().from(schema.course);
		},
	};
};
