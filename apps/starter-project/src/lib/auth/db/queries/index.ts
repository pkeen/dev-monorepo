import { users, lower } from "../schema";
import { eq } from "drizzle-orm";
import { getAuthConfig } from "../../config";

export const findUserByEmail = async (email: string) => {
	const db = getAuthConfig().db;
	const user = await db
		.select()
		.from(users)
		.where(eq(lower(users.email), email.toLowerCase()));
	return user[0];
};

export const insertUserAndReturnIt = async (
	db: any,
	data: {
		name: string;
		email: string;
		password: string;
	}
) => {
	const [user] = await db.insert(users).values(data).returning(); // This ensures the inserted record is returned
	return user;
};
