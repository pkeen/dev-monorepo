import type { db } from "@/lib/auth/db";
import * as schema from "@/lib/auth/db/schema";
import { faker } from "@faker-js/faker";
import { hashPassword } from "@/lib/auth/utils/password/password";

const seedUsers = async (db: db) => {
	const spoofUserArray = [];

	for (let i = 0; i < 10; i++) {
		const spoofUser = {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: await hashPassword(faker.internet.password()),
			image: faker.image.avatar(),
		};
		spoofUserArray.push(spoofUser);
	}

	const pete = {
		name: "pete",
		email: "pkeen7@gmail.com",
		password: await hashPassword("password"),
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
