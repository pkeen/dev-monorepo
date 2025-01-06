import { defineTables } from "@pete_keen/authentication-core/adapters";
import {
	pgSchema,
	text,
	timestamp,
	uniqueIndex,
	pgTable,
} from "drizzle-orm/pg-core";

const { usersTable } = defineTables();
const authSchema = pgSchema("auth");

const usersTableWithAuth = authSchema.table(
	"users",
	{
		id: text("id")
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: text("name"),
		email: text("email").unique(),
		emailVerified: timestamp("emailVerified", { mode: "date" }),
		image: text("image"),
		password: text("password"),
	}
	// (table) => ({
	// 	// emailUniqueIndex: uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
	// 	emailUniqueIndex: uniqueIndex("emailUniqueIndex").on(
	// 		lower(table.email)
	// 	),
	// })
);

export { usersTable, authSchema };
