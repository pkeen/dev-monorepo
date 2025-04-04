import { drizzle } from "drizzle-orm/neon-http";
import { env } from "~/env.server";

if (!env.DATABASE_URL) {
	throw new Error("DATABASE_URL not found in env");
}

const db = drizzle(env.DATABASE_URL, {
	logger: true,
	casing: "snake_case",
});

export type db = typeof db;

export default db;
