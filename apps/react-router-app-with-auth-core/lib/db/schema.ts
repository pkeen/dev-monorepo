import { defineTables } from "@pete_keen/authentication-core/adapters";
import { schema as AuthorizationSchema } from "@pete_keen/authentication-core/authorization";
import { rbacSchema as rbacAuthSchema } from "@pete_keen/authz/adapters";

export const { usersTable, authSchema, accountsTable } = defineTables();

// export const { schema, rolesTable, userRolesTable } = AuthorizationSchema;
export const { rolesTable, userRolesTable, rbacSchema } = rbacAuthSchema;
