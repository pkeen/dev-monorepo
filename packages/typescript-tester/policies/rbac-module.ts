// rbac-module.ts
import { HierachicalModule, User, Role } from "./types";
import {
	RbacPolicies,
	ExtendedSelectRole,
	RBACEnrichedData,
} from "./rbac-types";

/**
 * A generic RBACModule that depends on T to define typed "select" arguments.
 */
export interface RBACModule<T extends ReadonlyArray<Role>>
	extends HierachicalModule<RbacPolicies<T>, RBACEnrichedData> {
	updateUserRole: (
		userId: string,
		select: ExtendedSelectRole<T>
	) => Promise<void>;
	createUserRole: (
		userId: string,
		select: ExtendedSelectRole<T>
	) => Promise<void>;
}

/**
 * A generic RBAC config that references T.
 */
export interface RBACConfig<T extends ReadonlyArray<Role>> {
	items: T;
	defaultAssignment: ExtendedSelectRole<T>;
}

/**
 * Our "factory" function that returns an RBACModule<T>.
 */
export function rbacModule<T extends ReadonlyArray<Role>>(
	db: any, // e.g. a DB adapter
	config: RBACConfig<T>
): RBACModule<T> {
	// Derive dynamic union from T
	type RoleNameUnion = T[number]["name"];
	type RoleLevelUnion = T[number]["level"];
	type RoleKeyUnion = T[number]["key"];

	// The specialized policy arguments:
	const exact: RbacPolicies<T>["exact"] = (user, roleSelect) => {
		// You have typed user.roles, typed roleSelect
		// ...
		return true;
	};

	const min: RbacPolicies<T>["min"] = (user, roleSelect) => {
		// ...
		return user.roles.some((r) => r.level >= (roleSelect.level ?? 0));
	};

	const max: RbacPolicies<T>["max"] = (user, roleSelect) => {
		// ...
		return true;
	};

	return {
		name: "rbac",
		hierarchical: true,
		policies: { exact, min, max }, // strongly typed
		async enrichUser(user: User) {
			// e.g. fetch roles from db
			const roles = [{ key: "admin", name: "Admin", level: 2 }];
			return { ...user, roles };
		},
		async updateUserRole(userId, select) {
			// "select" is typed as ExtendedSelectRole<T>
			console.log("Updating user role to:", select);
		},
		async createUserRole(userId, select) {
			console.log("Creating user role:", select);
		},
	};
}
