import { defineTables } from "@pete_keen/authentication-core/adapters";
// import { rbacSchema as rbacAuthSchema } from "@pete_keen/authz/adapters";
// export { rbacSchema, rolesTable, userRolesTable } from "~/authz";
import { createSchema } from "@pete_keen/authz/adapters";

export const { usersTable, authSchema, accountsTable } = defineTables();


export const { rbacSchema, rolesTable, userRolesTable } = createSchema();

// export const { schema, rolesTable, userRolesTable } = AuthorizationSchema;
// export const { rolesTable, userRolesTable, rbacSchema } = rbacAuthSchema;

// export const { rbacSchema, rolesTable, userRolesTable } =
// 	rbacAuthSchema.createSchema("authz");
