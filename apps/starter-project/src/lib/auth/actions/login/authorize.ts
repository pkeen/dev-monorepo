"use server";
import { verifyPassword } from "@/lib/auth/utils/password/password";
import db from "@/lib/auth/db";
import { users } from "@/lib/auth/db/schema";
import { eq } from "drizzle-orm";

// let testUser = {
// 	id: "1",
// 	name: "Peter Keen",
// 	email: "pkeen7@gmail.com",
// 	password: "password",
// };

interface credentials {
	email: string;
	password: string;
}

export const authorize = async (credentials: credentials) => {
	console.log("Authorize called with:", credentials?.email);
	const { email, password } = credentials || {};

	// // first hash the test password
	// testUser.password = await hashPassword(testUser.password);

	try {
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, email));
		if (!user) {
			throw new Error("No user found");
		}
		if (!user.password) {
			throw new Error("No password found for user");
		}
		const authenticated = await verifyPassword(password, user.password);
		if (!authenticated) {
			throw new Error("Invalid password");
		}
		console.log("User logged in successfully");
		return user;
	} catch (err) {
		console.error("Error authorizing user, unkown error:", err);
		return null;
	}

	// try {
	// 	// verify user exist with given email
	// 	const user = email === testUser.email ? testUser : null;
	// 	if (!user) {
	// 		throw new Error("No user found");
	// 	}
	// 	const isValid = await verifyPassword(password as string, user.password);
	// 	if (!isValid) {
	// 		throw new Error("Invalid password");
	// 	}
	// 	console.log("User logged in successfully");
	// 	return user;
	// } catch (error) {
	// 	console.error("Error authorizing user, unkown error:", error);
	// 	return null;
	// }
};
