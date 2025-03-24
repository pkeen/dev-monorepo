import { RoleHierarchy } from "./index.types";
import { RBACConfig, Role, RoleConfigEntry, SelectRole } from "./index.types";
// import type { Authz } from "./index.types";
import type { Policy } from "../core/policy";
import type { RBACAdapter } from "../adapters/drizzle/rbac/rbac";
import { Module, User, HierachicalModule } from "../core/types";

// // These shouldnt be needed soon
// type DefaultSchema = typeof defaultSchema;

// type DrizzleDatabase =
// 	// | NodePgDatabase
// 	PgDatabase<PgQueryResultHKT, any> | NeonHttpDatabase;

// const toDBId = (id: string): number => parseInt(id, 10);

interface UserWithRoles {
	id: string;
	/** An array of roles associated with the user */
	roles: Role[];
}

export const RBAC = <T extends ReadonlyArray<RoleConfigEntry>>(
	db: RBACAdapter,
	config: RBACConfig<T>
): Module<{ roles: Omit<Role, "id">[] }> => {
	// ❸ Derive *dynamic* unions for name & level from T
	type RoleNameUnion = T[number]["name"]; // e.g. "Guest" | "User" | ...
	type RoleLevelUnion = T[number]["level"]; // e.g. 0 | 1 | 2 | 3 | ...

	// ❹ Create a specialized "SelectRole" type *just for this config*
	type ExtendedSelectRole =
		| { name: RoleNameUnion; level?: never }
		| { level: RoleLevelUnion; name?: never };

	const getRoles = async (userId: string) => {
		return await db.getUserRoles(userId);
	};

	const findRoleInConfig = (select: ExtendedSelectRole): Role | null => {
		if ("name" in select) {
			// Look up by name
			return config.roles.find((r) => r.name === select.name) ?? null;
		} else {
			// Look up by level
			return config.roles.find((r) => r.level === select.level) ?? null;
		}
	};

	const exact: Policy = (
		user: { id: string; roles: Role[] },
		role: ExtendedSelectRole
	) => {
		const foundRole = findRoleInConfig(role);
		if (!foundRole) {
			throw new Error(`Invalid role: ${JSON.stringify(role)}`);
		}
		// ISSUE: in a jwt strategy yes the user object contains roles, but in a session strategy no
		// but also perhaps by providing that callback for getUserRoles() etc we could achieve the same
		// OR we could have a db check fall back
		// if (!user.roles) {
		//     user.roles = await getRoles(user.id);
		// }
		// perhaps this useDB? option should be handled in the config?

		// TODO: decide if we want this fallback or not
		return user.roles.some((r) => r.name === foundRole.name);
	};

	const min: Policy<{ id: string; roles: Role[] }, ExtendedSelectRole> = (
		user: { id: string; roles: Role[] },
		role: ExtendedSelectRole
	) => {
		const foundRole = findRoleInConfig(role);
		if (!foundRole) {
			throw new Error(`Invalid role: ${JSON.stringify(role)}`);
		}

		return user.roles.some((r) => r.level >= foundRole.level);
	};

	const max: Policy = (
		user: { id: string; roles: Role[] },
		role: ExtendedSelectRole
	) => {
		const foundRole = findRoleInConfig(role);
		if (!foundRole) {
			throw new Error(`Invalid role: ${JSON.stringify(role)}`);
		}

		return user.roles.some((r) => r.level <= foundRole.level);
	};

	return {
		name: "rbac",
		init: async () => {
			await db.seed([...config.roles]);
			// The array spreading is because it is a readonly type made mutable
		},
		enrichUser: async (user: User) => {
			const roles = await getRoles(user.id);
			return { ...user, roles };
		},
		policies: {
			exact,
			min,
			max,
		},
		getRoles,
		// addRolesToUser: async (user: User): Promise<UserWithRoles> => {
		// 	const roles = await getRoles(user.id);
		// 	console.log("roles: ", roles);
		// 	return {
		// 		...user,
		// 		roles,
		// 	};
		// },
		// ISSUE: should perhaps be called enrichUser to make more sense in the db session strategy
		// enrichToken: async (
		// 	userId: string
		// ): Promise<{ roles: Omit<Role, "id">[] }> => {
		// 	const roles = await getRoles(userId);
		// 	console.log("roles: ", roles);
		// 	return {
		// 		roles,
		// 	};
		// },
		updateUserRole: async (
			userId: string,
			select?: ExtendedSelectRole
		): Promise<void> => {
			if (!select) {
				select = config.defaultRole;
			}
			// check select is in role config
			const foundRole = findRoleInConfig(select);
			if (!foundRole) {
				throw new Error(`Invalid role: ${JSON.stringify(select)}`);
			}

			return db.updateUserRoles(userId, [foundRole]);

			// update user's role

			// if (select.name) {
			// 	const [role] = await db
			// 		.select({ id: schema.rolesTable.id })
			// 		.from(schema.rolesTable)
			// 		.where(eq(schema.rolesTable.name, select.name));

			// 	if (!role) {
			// 		throw new Error(`Role ${select.name} does not exist`);
			// 	}

			// 	//update user's role
			// 	await db
			// 		.update(schema.userRolesTable)
			// 		.set({ roleId: role.id })
			// 		.where(eq(schema.userRolesTable.userId, userId));
			// } else if (select.level) {
			// 	const [role] = await db
			// 		.select({ id: schema.rolesTable.id })
			// 		.from(schema.rolesTable)
			// 		.where(eq(schema.rolesTable.level, select.level));

			// 	if (!role) {
			// 		throw new Error(
			// 			`Role with level ${select.level} does not exist`
			// 		);
			// 	}

			// 	//update user's role
			// 	await db
			// 		.update(schema.userRolesTable)
			// 		.set({ roleId: role.id })
			// 		.where(eq(schema.userRolesTable.userId, userId));
			// } else {
			// 	throw new Error(`Invalid role: ${select}`);
			// }
		},
		createUserRole: async (
			userId: string,
			select: ExtendedSelectRole = config.defaultRole
		) => {
			// if (!select) {
			// 	select = config.defaultRole;
			// }
			// check select is in role config
			const foundRole = findRoleInConfig(select);
			console.log("foundRole: ", foundRole);
			if (!foundRole) {
				throw new Error(`Invalid role: ${JSON.stringify(select)}`);
			}

			const role = await db.getRole(foundRole.name);
			if (!role) {
				throw new Error(`Role ${foundRole.name} does not exist`);
			}

			return await db.createUserRoles(userId, [role]);
		},
	};
};

export interface RBACModule extends HierachicalModule {
	name: string;
	init: () => Promise<void>;
	getRoles: (userId: string) => Promise<Omit<Role, "id">[]>;
	// addRolesToUser: (user: User) => Promise<UserWithRoles>;
	updateUserRole: (userId: string, role?: SelectRole) => Promise<void>;
	createUserRole: (userId: string, role?: SelectRole) => Promise<void>;
	// enrichToken: (userId: string) => Promise<Omit<Role, "id">[]>;
	// enrichUser: (userId: string) => Promise<Omit<Role, "id"> & User>;
	// policies: {
	// 	exact: Policy;
	// 	min: Policy;
	// 	max: Policy;
	// };
	// hierachical: true;
}

export { RoleHierarchy };
