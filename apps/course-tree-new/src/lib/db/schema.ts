import {
	createSchema,
	courseNodeNoCyclesTriggerSqlString,
} from "@pete_keen/courses-remake/db-adapters";
import { sql } from "drizzle-orm";

export const {
	courses,
	course,
	contentItem,
	courseNode,
	lessonDetail,
	videoProviderEnum,
	video,
	contentType,
} = createSchema();

export const courseNodeNoCyclesTriggerUp = sql.raw(
	courseNodeNoCyclesTriggerSqlString
);
