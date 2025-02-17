import { defineTables } from "@pete_keen/authentication-core/adapters";

// courses tables
export * from "../courses/db/schema";

// auth tables
export const { usersTable, authSchema, accountsTable } = defineTables();
