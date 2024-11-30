import db from "..";
import { users, lower } from "../schema";
import { eq } from "drizzle-orm";

export const findUserByEmail = async (email: string) => {
	const user = await db
		.select()
		.from(users)
		.where(eq(lower(users.email), email.toLowerCase()));
	return user[0];
};

export const insertUserAndReturnIt = async (data: {
	name: string;
	email: string;
	password: string;
}) => {
	const [user] = await db.insert(users).values(data).returning(); // This ensures the inserted record is returned
	return user;
};
