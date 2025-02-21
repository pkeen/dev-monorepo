export * from "./hierachical-rbac";
import * as defaultSchema from "./hierachical-rbac/db/schema";
import {
	PgDatabase,
	type PgQueryResultHKT,
	pgSchema,
} from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { Role, RolesAndPermissions } from "./hierachical-rbac/index.types";
import { defaultRoleHierarchy } from "./hierachical-rbac";

type DefaultSchema = typeof defaultSchema;

type DrizzleDatabase =
	// | NodePgDatabase
	PgDatabase<PgQueryResultHKT, any> | NeonHttpDatabase;

// const toDBId = (id: string): number => parseInt(id, 10);

export const RBAC = (
	db: DrizzleDatabase,
	schema: DefaultSchema = defaultSchema
) => {
	return {
		seed: async () => {
			console.log("seeding roles");
			await db
				.insert(schema.rolesTable)
				.values(Object.values(defaultRoleHierarchy))
				.onConflictDoNothing();
		},
		getRoles: async (userId: string): Promise<RolesAndPermissions> => {
			// Drizzle returns an array of joined rows.
			// We'll select specific columns from `rolesTable` so it's typed more cleanly.
			const rows = await db
				.select({
					// roleId: schema.rolesTable.id,
					roleName: schema.rolesTable.name,
					roleLevel: schema.rolesTable.level,
				})
				.from(schema.rolesTable)
				.innerJoin(
					schema.userRolesTable,
					eq(schema.userRolesTable.roleId, schema.rolesTable.id)
				)
				.where(eq(schema.userRolesTable.userId, userId));

			// Transform to your "Role" type
			const roles: Role[] = rows.map((row) => ({
				name: row.roleName,
				level: row.roleLevel,
			}));

			return {
				roles,
			};
		},
	};
};

export interface RBAC {
	seed: () => Promise<void>;
	getRoles: (userId: string) => Promise<RolesAndPermissions>;
}
