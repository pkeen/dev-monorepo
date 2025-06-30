import { createCoursesDBAdapter } from "@pete_keen/courses-remake/db-adapters";
import { CourseManager } from "@pete_keen/courses-remake";
import db from "@/db";

export const { adapter, schema } = createCoursesDBAdapter(db);
export const courses = CourseManager(adapter);
