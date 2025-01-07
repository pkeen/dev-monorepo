import { defineTables } from "@pete_keen/authentication-core/adapters";
import {
	pgSchema,
	text,
	timestamp,
	uniqueIndex,
	pgTable,
} from "drizzle-orm/pg-core";

const { usersTable, authSchema } = defineTables();

export { usersTable, authSchema };
