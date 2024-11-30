// import { loadEnv } from "@/utils/loadEnv";

// Load environment variables
// loadEnv();

import db from "@/lib/auth/db";
import * as seeds from "@/lib/auth/db/seeds";
import * as schema from "@/lib/auth/db/schema";
import truncateTable from "./truncateTable";

// Function to reset all the tables
async function resetTables() {
	for (const table of [
		schema.users,
		// schema.accounts,
		// schema.sessions,
		// schema.verificationTokens,
		// schema.authenticators,
	]) {
		// await db.delete(table); // clear tables without truncating / resetting ids
		await truncateTable(db, table);
	}
}

// Function to seed the tables
async function seed() {
	try {
		await seeds.user(db);
		console.log("Database seeded successfully!");
	} catch (err) {
		console.error("Error seeding database:", err);
	}
}

// Main function to reset and seed the tables
async function main() {
	await resetTables();
	await seed();
}

main().catch((err) => {
	console.error("Error in main function:", err);
	process.exit(1);
});
