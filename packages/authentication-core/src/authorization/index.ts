export * from "./hierachical-rbac";
import * as defaultSchema from "./hierachical-rbac/db/schema";
import {
	PgDatabase,
	type PgQueryResultHKT,
	pgSchema,
} from "drizzle-orm/pg-core";
import { eq } from "drizzle-orm";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
	Role,
	RolesAndPermissions,
	SelectRole,
} from "./hierachical-rbac/index.types";
import { defaultRoleHierarchy } from "./hierachical-rbac";

type DefaultSchema = typeof defaultSchema;

type DrizzleDatabase =
	// | NodePgDatabase
	PgDatabase<PgQueryResultHKT, any> | NeonHttpDatabase;

// const toDBId = (id: string): number => parseInt(id, 10);

export const RBAC = (
	db: DrizzleDatabase,
	defaultRole: SelectRole,
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
		updateUserRole: async (
			userId: string,
			role?: SelectRole
		): Promise<void> => {
			if (!role) {
				role = defaultRole;
			}

			if (role.name) {
				const [roleId] = await db
					.select({ id: schema.rolesTable.id })
					.from(schema.rolesTable)
					.where(eq(schema.rolesTable.name, role.name));

				if (!roleId) {
					throw new Error(`Role ${role.name} does not exist`);
				}

				//update user's role
				await db
					.update(schema.userRolesTable)
					.set({ roleId: roleId.id })
					.where(eq(schema.userRolesTable.userId, userId));
			} else if (role.level) {
				const [roleId] = await db
					.select({ id: schema.rolesTable.id })
					.from(schema.rolesTable)
					.where(eq(schema.rolesTable.level, role.level));

				if (!roleId) {
					throw new Error(
						`Role with level ${role.level} does not exist`
					);
				}

				//update user's role
				await db
					.update(schema.userRolesTable)
					.set({ roleId: roleId.id })
					.where(eq(schema.userRolesTable.userId, userId));
			} else {
				throw new Error(`Invalid role: ${role}`);
			}
		},
		createUserRole: async (
			userId: string,
			role?: SelectRole
		): Promise<void> => {
			console.log("creating user role");
			if (!role) {
				role = defaultRole;
			}
			console.log(role);

			if (role.name) {
				const [roleId] = await db
					.select({ id: schema.rolesTable.id })
					.from(schema.rolesTable)
					.where(eq(schema.rolesTable.name, role.name));

				if (!roleId) {
					throw new Error(`Role ${role.name} does not exist`);
				}

				// add user's role
				await db
					.insert(schema.userRolesTable)
					.values({ userId, roleId: roleId.id });
			} else if (role.level) {
				const [roleId] = await db
					.select({ id: schema.rolesTable.id })
					.from(schema.rolesTable)
					.where(eq(schema.rolesTable.level, role.level));

				if (!roleId) {
					throw new Error(
						`Role with level ${role.level} does not exist`
					);
				}

				// add user's role
				await db
					.insert(schema.userRolesTable)
					.values({ userId, roleId: roleId.id });
			} else {
				throw new Error(`Invalid role: ${role}`);
			}
		},
	};
};

export interface RBAC {
	seed: () => Promise<void>;
	getRoles: (userId: string) => Promise<RolesAndPermissions>;
	updateUserRole: (userId: string, role?: SelectRole) => Promise<void>;
	createUserRole: (userId: string, role?: SelectRole) => Promise<void>;
}
