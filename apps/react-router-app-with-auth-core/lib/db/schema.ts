import { defineTables } from "@pete_keen/authentication-core/adapters";
import { schema as AuthorizationSchema } from "@pete_keen/authentication-core/authorization";

export const { usersTable, authSchema, accountsTable } = defineTables();

export const { schema, rolesTable, userRolesTable } = AuthorizationSchema;
