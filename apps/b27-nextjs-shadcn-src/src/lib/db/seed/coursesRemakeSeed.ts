import * as courseSeed from "./courses-remake";
import db from "@/db";
import { schema as coursesSchema } from "@/courses";
import { resetTable } from "./utils";

export default async () => {
	import("dotenv").then((dotenv) => dotenv.config());
	console.log("db url", process.env.DATABASE_URL);
	for (const table of [
		coursesSchema.course,
		coursesSchema.contentItem,
		coursesSchema.courseNode,
		// coursesSchema.lessonDetail,
		// coursesSchema.video,
		// coursesSchema.contentType,
	]) {
		// await db.delete(table); // clear tables without truncating / resetting ids
		await resetTable(db, table, "courses");
	}

	// seed tables
	const seed = async () => {
		try {
			await courseSeed.course(db);
			await courseSeed.contentItem(db);
			await courseSeed.courseNode(db);

			// await seeds.user(db););
			// logBreak();
			// logSuccess("Database seeded successfully!");
			console.log("Database seeded successfully!");
		} catch (err) {
			console.error("Error seeding database:", err);
		}
	};

	seed();
};
