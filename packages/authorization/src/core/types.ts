import { Policy } from "./policy";

export interface User {
	id: string;
}

// export type HierachicalModule = Module & { hierachical: true; level: number };
export interface HierachicalModule<
	EnrichedData extends Record<string, any> = {}
> extends Module<EnrichedData> {
	hierachical: true;
	level: number;
}

export type AnyModule = Module<any> | HierachicalModule<any>;

export interface Module<EnrichedData extends Record<string, any> = {}> {
	name: string;
	policies: Record<string, Policy<any>>;
	pluralName?: string;
	hierachical?: boolean;
	init?: () => void;
	enrichUser?: (user: User) => Promise<User & EnrichedData>;
}

export interface IAuthZ {
	// Heres the choice, do we take an entities object/array and put all Roles, Permissions, Orgs etc in there
	// or do we have a Roles object, a Permissions object, and a custom entities object?

	modules: Record<string, AnyModule>;
	// should the schema and table be returned to user to add to their own migrations? probably yes
	// schemaName?: string; // ??? this needs to actually be at the level of the adpater I think

	policies: Record<string, Policy<any>>;

	userLifecycle: {
		enrichUser: (user: User) => Promise<User & Record<string, any>>;
		onUserCreated: (user: User) => Promise<void>;
	};
}

export interface AuthZConfig {
	modules: Array<AnyModule>;
	// policies: Record<string, Policy<any>>; // maybe not policy creation for now
}
