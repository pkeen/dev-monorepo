import { drizzle } from "drizzle-orm/neon-http";

// for scripting
import { config } from "dotenv";
config();

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL not found in process.env");
}

const db = drizzle(process.env.DATABASE_URL, {
	logger: true,
	casing: "snake_case",
});

// await initCourseSchema(db);

export type db = typeof db;

export default db;
