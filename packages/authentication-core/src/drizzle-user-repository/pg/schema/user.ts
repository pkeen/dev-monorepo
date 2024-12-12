// src/drizzleSchema.ts
import {
	boolean,
	timestamp,
	pgTable,
	text,
	primaryKey,
	integer,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { lower } from "./helpers/lower";
// import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable(
	"users",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text("name"),
		email: text("email").unique().notNull(),
		emailVerified: timestamp("emailVerified", { mode: "date" }),
		image: text("image"),
		password: text("password"),
	},
	(table) => ({
		// emailUniqueIndex: uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
		emailUniqueIndex: uniqueIndex("emailUniqueIndex").on(
			lower(table.email)
		),
	})
);
