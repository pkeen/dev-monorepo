import type { db } from "@/db";
import { schema } from "@/courses";
import { faker } from "@faker-js/faker";

const seed = async (db: db) => {
	const spoofCourseArray = [];

	for (let i = 0; i < 20; i++) {
		const spoofCourse = {
			userId: faker.string.uuid(),
			title: faker.company.buzzPhrase(), // 'cultivate synergistic e-markets'
			description: faker.lorem.sentences(),
			isPublished: faker.datatype.boolean(0.75),
			// publishedStatus: "published",
			// price: Math.random() < 0.5 ? 0 : faker.commerce.price({ max: 200 }),
		};
		spoofCourseArray.push(spoofCourse);
	}

	try {
		await db.insert(schema.course).values(spoofCourseArray);
		console.log("courses succesfully seeded...");
	} catch (error) {
		console.error("Error inserting courses:", error);
	}
};

export default seed;
