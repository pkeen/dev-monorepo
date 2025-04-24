import { createCoursesDBAdapter } from "@pete_keen/courses/db-adapters";
import db from "@/db";

export const { adapter, schema } = createCoursesDBAdapter(db);
