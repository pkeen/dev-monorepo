import * as courseSeed from "~/lib/courses/db/seed";
import db from ".";
// import { logError, logInfo, logSuccess, logWarning, logBreak } from "../chalk";
// import * as schema from "./schema";
import * as coursesSchema from "~/lib/courses/db/schema";
import { resetTable } from "./utils";

console.log("courses schema", coursesSchema);

// reset tables

for (const table of [
	// schema.user, // Dont need for now
	coursesSchema.course,
	coursesSchema.module,
	coursesSchema.lesson,
	coursesSchema.moduleSlot,
	coursesSchema.courseSlot,
]) {
	// await db.delete(table); // clear tables without truncating / resetting ids
	await resetTable(db, table, "courses");
}

// seed tables
const seed = async () => {
	try {
		await courseSeed.course(db);
		await courseSeed.module(db);
		await courseSeed.lesson(db);
		await courseSeed.moduleSlot(db);
		await courseSeed.courseSlot(db);

		// await seeds.user(db););
		// logBreak();
		// logSuccess("Database seeded successfully!");
		console.log("Database seeded successfully!");
	} catch (err) {
		console.error("Error seeding database:", err);
	}
};

seed();
