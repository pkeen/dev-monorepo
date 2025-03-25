// types.ts

export interface User {
	id: string;
	[key: string]: any;
}

export interface Policy<UserArg = any, PolicyArg = any> {
	(user: UserArg, policyArg: PolicyArg): boolean;
}

/**
 * Minimal role type for demonstration.
 */
export interface Role {
	key: string;
	name: string;
	level: number;
}

/**
 * "AttributeData" is a common shape any module might add to the user object.
 */
export interface AttributeData {
	[key: string]: any;
}

/**
 * A "HierachicalModule" that extends a base "Module" with a
 * typed policies property (including min, max, exact).
 */
export interface HierachicalModule<
	Policies extends Record<string, Policy<any, any>>,
	EnrichedData extends Record<string, any> = {}
> {
	name: string;
	hierarchical: true;
	policies: Policies;
	enrichUser?: (user: User) => Promise<User & EnrichedData>;
	// you can add init, onUserCreated, etc. if you like
}

/**
 * This union could also include a normal `Module` type,
 * but for demonstration we only have `HierachicalModule`.
 */
export type AnyModule = HierachicalModule<any, any>;
