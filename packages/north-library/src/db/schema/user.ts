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

// export const accounts = pgTable(
// 	"accounts",
// 	{
// 		userId: text("user_id")
// 			.notNull()
// 			.references(() => users.id, { onDelete: "cascade" }),
// 		type: text("type").$type<AdapterAccountType>().notNull(),
// 		provider: text("provider").notNull(),
// 		providerAccountId: text().notNull(),
// 		refresh_token: text("refresh_token"),
// 		access_token: text("access_token"),
// 		expires_at: integer("expires_at"),
// 		token_type: text("token_type"),
// 		scope: text("scope"),
// 		id_token: text("id_token"),
// 		session_state: text("session_state"),
// 	},
// 	(account) => ({
// 		compoundKey: primaryKey({
// 			columns: [account.provider, account.providerAccountId],
// 		}),
// 	})
// );

// export const sessions = pgTable("session", {
// 	sessionToken: text("session_tokens").primaryKey(),
// 	userId: text("user_id")
// 		.notNull()
// 		.references(() => users.id, { onDelete: "cascade" }),
// 	expires: timestamp("expires", { mode: "date" }).notNull(),
// });

// export const verificationTokens = pgTable(
// 	"verification_tokens",
// 	{
// 		identifier: text("identifier").notNull(),
// 		token: text("token").notNull(),
// 		expires: timestamp("expires", { mode: "date" }).notNull(),
// 	},
// 	(verificationToken) => ({
// 		compositePk: primaryKey({
// 			columns: [verificationToken.identifier, verificationToken.token],
// 		}),
// 	})
// );

// export const authenticators = pgTable(
// 	"authenticators",
// 	{
// 		credentialID: text("credentialID").notNull().unique(),
// 		userId: text("userId")
// 			.notNull()
// 			.references(() => users.id, { onDelete: "cascade" }),
// 		providerAccountId: text("providerAccountId").notNull(),
// 		credentialPublicKey: text("credentialPublicKey").notNull(),
// 		counter: integer("counter").notNull(),
// 		credentialDeviceType: text("credentialDeviceType").notNull(),
// 		credentialBackedUp: boolean("credentialBackedUp").notNull(),
// 		transports: text("transports"),
// 	},
// 	(authenticator) => ({
// 		compositePK: primaryKey({
// 			columns: [authenticator.userId, authenticator.credentialID],
// 		}),
// 	})
// );
