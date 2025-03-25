// rbac-types.ts
import { User, Role, AttributeData, Policy } from "./types";

/**
 * The extra data we add to a user object in RBAC.
 */
export interface RBACEnrichedData extends AttributeData {
	roles: Role[];
}

/**
 * For each array T extends ReadonlyArray<Role>, we define
 * an "ExtendedSelectRole<T>" that picks from T[number].
 */
export type ExtendedSelectRole<T extends ReadonlyArray<Role>> =
	| { name: T[number]["name"]; level?: never; key?: never }
	| { level: T[number]["level"]; name?: never; key?: never }
	| { key: T[number]["key"]; name?: never; level?: never };

/**
 * The dictionary of policies with typed arguments.
 */
export type RbacPolicies<T extends ReadonlyArray<Role>> = {
	exact: Policy<{ id: string; roles: Role[] }, ExtendedSelectRole<T>>;
	min: Policy<{ id: string; roles: Role[] }, ExtendedSelectRole<T>>;
	max: Policy<{ id: string; roles: Role[] }, ExtendedSelectRole<T>>;
};
