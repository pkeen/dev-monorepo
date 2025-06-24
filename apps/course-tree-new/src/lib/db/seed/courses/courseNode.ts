import type { db } from "@/db";
import { schema } from "@/courses";
import { faker } from "@faker-js/faker";

const seed = async (db: db) => {
	const spoofCourseNodeArray = [];

	for (let i = 0; i < 100; i++) {
		const spoofCourseNode = {
			courseId: Math.ceil(Math.random() * 20), // 'cultivate synergistic e-markets'
			parentId: null,
			order: Math.ceil(Math.random() * 10), // 'cultivate synergistic e-markets'
			contentId: Math.ceil(Math.random() * 60), // 'cultivate synergistic e-markets'
		};
		spoofCourseNodeArray.push(spoofCourseNode);
	}

	try {
		await db.insert(schema.courseNode).values(spoofCourseNodeArray);
		console.log("course nodes succesfully seeded...");
	} catch (error) {
		console.error("Error inserting course nodes:", error);
	}
};

export default seed;
