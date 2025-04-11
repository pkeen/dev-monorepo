import { defineTables } from "@pete_keen/authentication-core/adapters";
import { createSchema } from "@pete_keen/authz/adapters";

export const { usersTable, authSchema, accountsTable } = defineTables();

export const { rbacSchema, rolesTable, userRolesTable } = createSchema();
