import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
	schema: "./src/lib/db/schema/index.ts", // Path to schema file
	out: "./src/lib/db/migrations", // Directory to store migration files
	dbCredentials: {
		url: databaseUrl,
	},
	verbose: true,
	casing: "snake_case",
});
