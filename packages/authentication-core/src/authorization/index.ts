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
	RBACConfig,
	Role,
	RolesAndPermissions,
	SelectRole,
} from "./hierachical-rbac/index.types";
import { defaultRoleHierarchy } from "./hierachical-rbac";
import type { Authz } from "./index.types";

type DefaultSchema = typeof defaultSchema;

type DrizzleDatabase =
	// | NodePgDatabase
	PgDatabase<PgQueryResultHKT, any> | NeonHttpDatabase;

// const toDBId = (id: string): number => parseInt(id, 10);

interface User {
	id: string;
}

interface UserWithRoles {
	id: string;
	roles: Role[];
}

export const RBAC = (
	db: DrizzleDatabase,
	config: RBACConfig,
	schema: DefaultSchema = defaultSchema
) => {
	const getRoles = async (userId: string): Promise<RolesAndPermissions> => {
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
	};

	const findRoleInConfig = (
		select: SelectRole,
		config: RBACConfig
	): Role | null => {
		if ("name" in select) {
			// Look up by name
			return config.roles.find((r) => r.name === select.name) ?? null;
		} else {
			// Look up by level
			return config.roles.find((r) => r.level === select.level) ?? null;
		}
	};

	return {
		seed: async () => {
			console.log("seeding roles");
			await db
				.insert(schema.rolesTable)
				.values(defaultRoleHierarchy)
				.onConflictDoNothing();
		},
		getRoles,
		addRolesToUser: async (user: User): Promise<UserWithRoles> => {
			const roles = await getRoles(user.id);
			console.log("roles: ", roles);
			return {
				...user,
				roles: roles.roles,
			};
		},
		enrichToken: async (userId: string): Promise<{ roles: Role[] }> => {
			const roles = await getRoles(userId);
			console.log("roles: ", roles);
			return {
				roles: roles.roles,
			};
		},
		updateUserRole: async (
			userId: string,
			select?: SelectRole
		): Promise<void> => {
			if (!select) {
				select = config.defaultRole;
			}

			if (select.name) {
				const [role] = await db
					.select({ id: schema.rolesTable.id })
					.from(schema.rolesTable)
					.where(eq(schema.rolesTable.name, select.name));

				if (!role) {
					throw new Error(`Role ${select.name} does not exist`);
				}

				//update user's role
				await db
					.update(schema.userRolesTable)
					.set({ roleId: role.id })
					.where(eq(schema.userRolesTable.userId, userId));
			} else if (select.level) {
				const [role] = await db
					.select({ id: schema.rolesTable.id })
					.from(schema.rolesTable)
					.where(eq(schema.rolesTable.level, select.level));

				if (!role) {
					throw new Error(
						`Role with level ${select.level} does not exist`
					);
				}

				//update user's role
				await db
					.update(schema.userRolesTable)
					.set({ roleId: role.id })
					.where(eq(schema.userRolesTable.userId, userId));
			} else {
				throw new Error(`Invalid role: ${select}`);
			}
		},
		createUserRole: async (
			userId: string,
			select?: SelectRole
		): Promise<void> => {
			console.log("creating user role");
			if (!select) {
				select = config.defaultRole;
			}
			console.log(select);

			if (select.name) {
				const [role] = await db
					.select({ id: schema.rolesTable.id })
					.from(schema.rolesTable)
					.where(eq(schema.rolesTable.name, select.name));

				if (!role) {
					throw new Error(`Role ${select.name} does not exist`);
				}

				// add user's role
				await db
					.insert(schema.userRolesTable)
					.values({ userId, roleId: role.id });
			} else if (select.level) {
				const [roleId] = await db
					.select({ id: schema.rolesTable.id })
					.from(schema.rolesTable)
					.where(eq(schema.rolesTable.level, select.level));

				if (!roleId) {
					throw new Error(
						`Role with level ${select.level} does not exist`
					);
				}

				// add user's role
				await db
					.insert(schema.userRolesTable)
					.values({ userId, roleId: roleId.id });
			} else {
				throw new Error(`Invalid role: ${select}`);
			}
		},
		/**
		 * Check if a user has (at least) the required role
		 * based on numeric "level".
		 * If you want an exact match on name, adjust accordingly.
		 */
		async userHasRequiredRole(
			userId: string,
			required: SelectRole
		): Promise<boolean> {
			// 1. Find the required role in the config
			const requiredRoleDef = findRoleInConfig(required, config);
			if (!requiredRoleDef) {
				throw new Error(
					`Invalid required role: ${JSON.stringify(required)}`
				);
			}

			// 2. Lookup the user’s current role in DB (including level)
			// For example, if "userRolesTable" -> "rolesTable" is a simple pivot
			const row = await db
				.select({
					roleId: schema.rolesTable.id,
					roleName: schema.rolesTable.name,
					roleLevel: schema.rolesTable.level, // if your table has "level"
				})
				.from(schema.rolesTable)
				.innerJoin(
					schema.userRolesTable,
					eq(schema.userRolesTable.roleId, schema.rolesTable.id)
				)
				.where(eq(schema.userRolesTable.userId, userId))
				.limit(1);

			// If user has no role record, block
			if (!row[0]) return false;

			const userRoleLevel = row[0].roleLevel;

			// 3. Compare levels (assuming a linear approach)
			return userRoleLevel >= requiredRoleDef.level;
		},
	};
};

export interface RBAC {
	seed: () => Promise<void>;
	getRoles: (userId: string) => Promise<RolesAndPermissions>;
	addRolesToUser: (user: User) => Promise<UserWithRoles>;
	updateUserRole: (userId: string, role?: SelectRole) => Promise<void>;
	createUserRole: (userId: string, role?: SelectRole) => Promise<void>;
	enrichToken: (userId: string) => Promise<{ roles: Role[] }>;
}
