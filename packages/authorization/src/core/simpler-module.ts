import { Policy } from "./policy";

export interface User {
	id: string;
	[key: string]: any;
}

/**
 * The main attribute base, always has key and name
 */
export interface AttributeBase {
	key: string;
	name: string;
	// If you need "level", you can keep it optional
	// and modules that need it can require it
	// level?: number;
	// ...other optional fields
}

export interface AttributeData extends Record<string, any> {}

export interface Module<AttributeData = {}> {
	name: Readonly<string>;
	policies: Record<string, Policy>;
	pluralName?: string;
	hierarchical?: boolean;
	init?: () => Promise<void>;
	enrichUser?: (user: User) => Promise<User & AttributeData>;
	onUserCreated?: (user: User) => Promise<void>;
	onUserDeleted?: (user: User) => Promise<void>;
	getItemsForUser: (user: User) => Promise<AttributeData>;
	// createUserItem?: (userId: string, item: ConfigEntryBase) => Promise<void>;
}

export interface HierachicalModule<AttributeData = {}>
	extends Module<AttributeData> {
	hierarchical: true;
	policies: Record<string, Policy> & {
		min: Policy;
		max: Policy;
		exact: Policy;
	};
}

export type AnyModule = Module<any> | HierachicalModule<any>;

export const createModule = <
	Policies extends Record<string, Policy<any>>,
	AD extends AttributeData = {}
>(config: {
	name: string;
	policies: Policies;
	pluralName?: string;
	hierarchical?: boolean;
	init?: () => Promise<void>;
	enrichUser?: (user: User) => Promise<User & AD>;
	getItemsForUser: (user: User) => Promise<AD>;
}): Module<AttributeData> => {
	return {
		name: config.name,
		policies: config.policies,
		pluralName: config.pluralName,
		init: config.init,
		hierarchical: config.hierarchical,
		enrichUser: config.enrichUser,
		getItemsForUser: config.getItemsForUser,
	};
};

/**
 * The generic config for a module that has an array of items.
 * T extends ReadonlyArray<ConfigEntryBase> to ensure compile-time array of entries.
 */
export type ModuleConfig<
	T extends ReadonlyArray<AttributeBase>,
	D = T[number]["key"]
> = {
	items: T;
	// Optionally define a default item the user must provide from T
	defaultAssignment?: D;
	// Or more advanced union logic, like you do with role-level union
};
