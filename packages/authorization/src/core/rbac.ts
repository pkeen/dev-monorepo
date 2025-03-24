import { ModuleConfig, ConfigEntryBase, createModule, User } from "./module";
import { RBACAdapter } from "adapters";
import { Policy } from "./policy";

export interface Role extends ConfigEntryBase {
	level: number;
}

export interface RBACConfig<T extends ReadonlyArray<Role>>
	extends ModuleConfig<
		T,
		| { name: T[number]["name"]; level?: never; key?: never }
		| { level: T[number]["level"]; name?: never; key?: never }
		| { key: T[number]["key"]; name?: never; level?: never }
	> {
	// For the defaultItem, we now use the same pattern of
	// generating a union from T[number]['name'] or T[number]['level']:
	// defaultRole:
	// 	| { name: T[number]["name"]; level?: never; key?: never }
	// 	| { level: T[number]["level"]; name?: never; key?: never }
	// 	| { key: T[number]["key"]; name?: never; level?: never };
}

type RBACEnrichedData = {roles: Role[]}

export const createRBAC = <T extends ReadonlyArray<Role>>(
	db: RBACAdapter,
	config: RBACConfig<T>
) => {
	// ❸ Derive *dynamic* unions for name & level from T
	type RoleNameUnion = T[number]["name"]; // e.g. "Guest" | "User" | ...
	type RoleLevelUnion = T[number]["level"]; // e.g. 0 | 1 | 2 | 3 | ...
	type RoleKeyUnion = T[number]["key"]; // e.g. "guest" | "user" | ...

	// ❹ Create a specialized "SelectRole" type *just for this config*
	type ExtendedSelectRole =
		| { name: RoleNameUnion; level?: never; key?: never }
		| { level: RoleLevelUnion; name?: never; key?: never }
		| { key: RoleKeyUnion; name?: never; level?: never };

	const getItemsForUser = async (userId: string) => {
		return await db.getUserRoles(userId);
	};

	const findItemInConfig = (
		select: ExtendedSelectRole
	): Role | null => {
		if ("name" in select) {
			// Look up by name
			return config.items.find((r) => r.name === select.name) ?? null;
		} else {
			// Look up by level
			return config.items.find((r) => r.level === select.level) ?? null;
		}
	};

    // const policies: Record<string, Policy> = {
    //     exact: (user: { id: string } & RBACEnrichedData, role: ExtendedSelectRole) => {
    //         const foundRole = findItemInConfig(role);
    //         if (!foundRole) {
    //             throw new Error(`Invalid role: ${JSON.stringify(role)}`);
    //         }
    //         // ISSUE: in a jwt strategy yes the user object contains roles, but in a session strategy no
    //         // but also perhaps by providing that callback for getUserRoles() etc we could achieve the same
    //         // OR we could have a db check fall back
    //         // if (!user.roles) {
    //         //     user.roles = await getRoles(user.id);
    //         // }
    //         // perhaps this useDB? option should be handled in the config?

    //         // TODO: decide if we want this fallback or not
    //         return user.roles?.some((r) => r.name === foundRole.name) ?? false;
    //     },
    //     min: (
	// 	user: { id: string; roles: Role[] },
	// 	role: ExtendedSelectRole
	// ) => {
	// 	const foundRole = findItemInConfig(role);
	// 	if (!foundRole) {
	// 		throw new Error(`Invalid role: ${JSON.stringify(role)}`);
	// 	}

	// 	return user.roles.some((r) => r.level >= foundRole.level);
	// },

    // }

	const exact: Policy = (
		user: { id: string} & RBACEnrichedData,
		role: ExtendedSelectRole
	) => {
		const foundRole = findItemInConfig(role);
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
		return user.roles?.some((r) => r.name === foundRole.name) ?? false;
	};

	const min: Policy<{ id: string; roles: Role[] }, ExtendedSelectRole> = (
		user: { id: string; roles: Role[] },
		role: ExtendedSelectRole
	) => {
		const foundRole = findItemInConfig(role);
		if (!foundRole) {
			throw new Error(`Invalid role: ${JSON.stringify(role)}`);
		}

		return user.roles.some((r) => r.level >= foundRole.level);
	};

	const max: Policy = (
		user: { id: string; roles: Role[] },
		role: ExtendedSelectRole
	) => {
		const foundRole = findItemInConfig(role);
		if (!foundRole) {
			throw new Error(`Invalid role: ${JSON.stringify(role)}`);
		}

		return user.roles.some((r) => r.level <= foundRole.level);
	};

    const policies = {exact, min, max}


	return createModule<typeof policies, RBACEnrichedData>({
		name: "rbac" as const,// <-- key point: literal type
		policies,
		init: async () => {
			await db.seed([...config.items]);
			// The array spreading is because it is a readonly type made mutable
		},
		enrichUser: async (user: User) => {
			const roles = await getItemsForUser(user.id);
			return { ...user, roles };
		},
		getItemsForUser: async (user: User) => {
            const roles = await db.getUserRoles(user.id);
			return {roles};
		},

		updateUserRole: async (
			userId: string,
			select?: ExtendedSelectRole
		): Promise<void> => {
			if (!select) {
				select = config.defaultAssignment;
			}
			// check select is in role config
			const foundRole = findItemInConfig(select);
			if (!foundRole) {
				throw new Error(`Invalid role: ${JSON.stringify(select)}`);
			}

			const role = await db.getRole(foundRole.name);
			if (!role) {
				throw new Error(`Role ${foundRole.name} does not exist`);
			}

			return db.updateUserRoles(userId, [role]);
		},
		createUserRole: async (
			userId: string,
			select: ExtendedSelectRole = config.defaultAssignment
		) => {
			// check select is in role config
			const foundRole = findItemInConfig(select);
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
