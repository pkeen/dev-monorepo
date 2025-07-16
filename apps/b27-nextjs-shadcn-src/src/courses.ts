import { createCoursesDBAdapter } from "@pete_keen/courses-core/db-adapters";
import { CourseManager } from "@pete_keen/courses-core";
import db from "@/db";

export const { adapter, schema } = createCoursesDBAdapter(db);
export const courses = CourseManager(adapter);
