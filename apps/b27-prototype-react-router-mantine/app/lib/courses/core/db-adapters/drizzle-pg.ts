// import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgDatabase, type PgQueryResultHKT } from "drizzle-orm/pg-core";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as defaultSchema from "./schema";
import type { CourseInput, Course } from "../index.types";
import { eq } from "drizzle-orm";

type DefaultSchema = typeof defaultSchema;

type DrizzleDatabase =
	// | NodePgDatabase
	PgDatabase<PgQueryResultHKT, any> | NeonHttpDatabase;

const toDBId = (id: string): number => parseInt(id, 10);

// Is the defineTables function still needed?
// export function defineTables(
// 	schema: Partial<DefaultSchema> = defaultSchema
// ): Required<DefaultSchema> {

// 	const usersTable =
// 		schema.usersTable ??
// 		(authSchema.table(
// 			"users",
// 			{
// 				id: text("id")
// 					.primaryKey()
// 					.$defaultFn(() => crypto.randomUUID()),
// 				name: text("name"),
// 				email: text("email").unique(),
// 				emailVerified: timestamp("emailVerified", { mode: "date" }),
// 				image: text("image"),
// 				password: text("password"),
// 				role: text("role").$type<Role>().notNull().default("user"),
// 			},
// 			(table) => ({
// 				// emailUniqueIndex: uniqueIndex('emailUniqueIndex').on(sql`lower(${table.email})`),
// 				emailUniqueIndex: uniqueIndex("emailUniqueIndex").on(
// 					lower(table.email)
// 				),
// 			})
// 		) satisfies DefaultPostgresUsersTable);

// 	const accountsTable =
// 		schema.accountsTable ??
// 		(authSchema.table(
// 			"account",
// 			{
// 				userId: text("userId")
// 					.notNull()
// 					.references(() => usersTable.id, { onDelete: "cascade" }),
// 				type: text("type").$type<ProviderType>().notNull(),
// 				provider: text("provider").notNull(),
// 				providerAccountId: text("providerAccountId").notNull(),
// 				refresh_token: text("refresh_token"),
// 				access_token: text("access_token"),
// 				expires_at: integer("expires_at"),
// 				token_type: text("token_type"),
// 				scope: text("scope"),
// 				id_token: text("id_token"),
// 				session_state: text("session_state"),
// 			},
// 			(account) => ({
// 				compositePk: primaryKey({
// 					columns: [account.provider, account.providerAccountId],
// 				}),
// 			})
// 		) satisfies DefaultPostgresAccountsTable);

// 	// const sessionsTable =
// 	// 	schema.sessionsTable ??
// 	// 	(pgTable("session", {
// 	// 		sessionToken: text("sessionToken").primaryKey(),
// 	// 		userId: text("userId")
// 	// 			.notNull()
// 	// 			.references(() => usersTable.id, { onDelete: "cascade" }),
// 	// 		expires: timestamp("expires", { mode: "date" }).notNull(),
// 	// 	}) satisfies DefaultPostgresSessionsTable);

// 	// const verificationTokensTable =
// 	// 	schema.verificationTokensTable ??
// 	// 	(pgTable(
// 	// 		"verificationToken",
// 	// 		{
// 	// 			identifier: text("identifier").notNull(),
// 	// 			token: text("token").notNull(),
// 	// 			expires: timestamp("expires", { mode: "date" }).notNull(),
// 	// 		},
// 	// 		(verficationToken) => ({
// 	// 			compositePk: primaryKey({
// 	// 				columns: [
// 	// 					verficationToken.identifier,
// 	// 					verficationToken.token,
// 	// 				],
// 	// 			}),
// 	// 		})
// 	// 	) satisfies DefaultPostgresVerificationTokenTable);

// 	// const authenticatorsTable =
// 	// 	schema.authenticatorsTable ??
// 	// 	(pgTable(
// 	// 		"authenticator",
// 	// 		{
// 	// 			credentialID: text("credentialID").notNull().unique(),
// 	// 			userId: text("userId")
// 	// 				.notNull()
// 	// 				.references(() => usersTable.id, { onDelete: "cascade" }),
// 	// 			providerAccountId: text("providerAccountId").notNull(),
// 	// 			credentialPublicKey: text("credentialPublicKey").notNull(),
// 	// 			counter: integer("counter").notNull(),
// 	// 			credentialDeviceType: text("credentialDeviceType").notNull(),
// 	// 			credentialBackedUp: boolean("credentialBackedUp").notNull(),
// 	// 			transports: text("transports"),
// 	// 		},
// 	// 		(authenticator) => ({
// 	// 			compositePK: primaryKey({
// 	// 				columns: [authenticator.userId, authenticator.credentialID],
// 	// 			}),
// 	// 		})
// 	// 	) satisfies DefaultPostgresAuthenticatorTable);

// 	return {
// 		usersTable,
// 		authSchema,
// 		accountsTable,
// 		// sessionsTable,
// 		// verificationTokensTable,
// 		// authenticatorsTable,
// 	};
// }

// what type is this?
export const DrizzlePGAdapter = (
	db: DrizzleDatabase,
	schema: DefaultSchema = defaultSchema
) => {
	return {
		createCourse: async (input: CourseInput): Promise<Course> => {
			const [course] = await db
				.insert(schema.course)
				.values(input)
				.returning();
			return course;
		},
		getCourse: (id: string) => {
			return db
				.select()
				.from(schema.course)
				.where(eq(schema.course.id, toDBId(id)));
		},
		updateCourse: async (
			id: string,
			data: Partial<CourseInput>
		): Promise<Course> => {
			const [course] = await db
				.update(schema.course)
				.set(data)
				.where(eq(schema.course.id, toDBId(id)))
				.returning();
			return course;
		},
		deleteCourse: async (id: string): Promise<void> => {
			await db
				.delete(schema.course)
				.where(eq(schema.course.id, toDBId(id)));
		},
		logSchema: () => {
			console.log(schema);
		},
		listCourses: () => {
			return db.select().from(schema.course);
		},
	};
};
