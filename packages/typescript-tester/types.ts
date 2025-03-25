// --------------------------
// types.ts
// --------------------------
export interface User {
	id: string;
}

export interface Policy<Args = any> {
	(user: User, args: Args): boolean;
}

export interface Module<
	Policies extends Record<string, Policy<any>>,
	EnrichedData extends Record<string, any> = {}
> {
	name: Readonly<string>; // Will become literal with 'as const'
	policies: Policies;
	init?: () => Promise<void>;
	enrichUser?: (user: User) => Promise<User & EnrichedData>;
	getItemsForUser: (user: User) => Promise<EnrichedData>;
}

// For "hierarchical" modules
export interface HierarchicalModule<
	Policies extends Record<string, Policy<any>>,
	EnrichedData extends Record<string, any> = {}
> extends Module<Policies, EnrichedData> {
	hierarchical: true;
	policies: Policies & {
		min: Policy;
		max: Policy;
		exact: Policy;
	};
}

export type AnyModule = Module<any> | HierarchicalModule<any>;

export interface IAuthZ<M extends Record<string, AnyModule>> {
	modules: M;
	policies: {
		[K in keyof M]: M[K]["policies"];
	};
	userLifecycle: {
		enrichUser: (user: User) => Promise<User & Record<string, any>>;
		onUserCreated: (user: User) => Promise<void>;
	};
}

// The config must be <A extends AnyModule[]> so we can preserve an array with typed modules
export interface AuthZConfig<A extends AnyModule[]> {
	modules: [...A];
}
