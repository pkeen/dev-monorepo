import type { db } from "~/lib/db";
import * as schema from "../schema";
import { faker } from "@faker-js/faker";

const seed = async (db: db) => {
	const spoofArray = [];

	for (let i = 0; i < 60; i++) {
		const spoofData = {
			userId: Math.floor(Math.random() * 10) + 1,
			name: faker.company.buzzPhrase(),
			text: faker.lorem.sentences(),
			isPublished: faker.datatype.boolean(0.75),
			// isFree: faker.datatype.boolean(0.3),
			// videoLink: faker.internet.url(),
		};
		spoofArray.push(spoofData);
	}

	try {
		await db.insert(schema.lesson).values(spoofArray);
		console.log("lessons succesfully seeded...");
	} catch (error) {
		console.error("Error inserting lessons:", error);
	}
};

export default seed;
