import {
	createSchema,
	// courseNodeNoCyclesTriggerSqlString,
} from "@pete_keen/courses-core/db-adapters";
// import { sql } from "drizzle-orm";

export const {
	courses,
	course,
	contentItem,
	courseNode,
	lessonDetail,
	videoProviderEnum,
	videoDetail,
	contentType,
} = createSchema();

// export const courseNodeNoCyclesTriggerUp = courseNodeNoCyclesTriggerUp;
