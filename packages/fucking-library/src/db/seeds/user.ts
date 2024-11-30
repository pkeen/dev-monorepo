// import type { db } from "@/lib/auth/db";
// import { db } from "@db/index";
import * as schema from "@db/schema";
import { faker } from "@faker-js/faker";
import { utils } from "@main";

const seedUsers = async (db) => {
	const spoofUserArray = [];

	for (let i = 0; i < 10; i++) {
		const spoofUser = {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: await utils.password.hash(faker.internet.password()),
			image: faker.image.avatar(),
		};
		spoofUserArray.push(spoofUser);
	}

	const pete = {
		name: "pete",
		email: "pkeen7@gmail.com",
		password: await utils.password.hash("password"),
		image: faker.image.avatar(),
	};
	spoofUserArray.push(pete);

	try {
		await db.insert(schema.users).values(spoofUserArray);
		console.log("users succesfully seeded...");
	} catch (error) {
		console.error("Error inserting user:", error);
	}
};
// seedUsers();

export default seedUsers;
