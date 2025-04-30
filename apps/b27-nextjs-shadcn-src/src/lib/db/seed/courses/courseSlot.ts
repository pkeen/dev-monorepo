import type { db } from "@/db";
import { schema } from "@/courses";
import { faker } from "@faker-js/faker";

type SpoofData = {
	courseId: number;
	order: number;
	moduleId?: number;
	lessonId?: number;
};

const seed = async (db: db) => {
	const spoofArray = [];

	for (let i = 0; i < 50; i++) {
		let spoofData: SpoofData = {
			courseId: Math.floor(Math.random() * 20) + 1,
			order: Math.floor(Math.random() * 10) + 1,
		};

		if (Math.floor(Math.random() * 10) % 2 === 0) {
			spoofData = {
				...spoofData,
				moduleId: Math.floor(Math.random() * 30) + 1,
			};
		} else {
			spoofData = {
				...spoofData,
				lessonId: Math.floor(Math.random() * 60) + 1,
			};
		}

		spoofArray.push(spoofData);
	}

	try {
		await db.insert(schema.courseSlot).values(spoofArray);
		console.log("courseSlots succesfully seeded...");
	} catch (error) {
		console.error("Error inserting courseSlots:", error);
	}
};

export default seed;
