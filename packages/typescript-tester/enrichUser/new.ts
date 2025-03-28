export function createEnrichUser<
	Fn extends (user: User) => Promise<User & Record<string, any>>
>(fn: Fn): Fn {
	return fn;
}

export type User = {
	id: string;
	name: string;
	email: string | null;
	image: string | null;
};

// --- Level 1 the enrich function

const enrichUser = createEnrichUser(async (user) => {
	return {
		...user,
		role: "admin",
		team: "Engineering",
	};
});

const test1 = async () => {
	const enrichedUser = await enrichUser({
		id: "123",
		name: "John Doe",
		email: "john.doe@example.com",
		image: null,
	});

	console.log("Using createEnrichedUser", enrichedUser.role); // This is typed
};

// --- Level 2 the Callbacks Level

export interface AuthNCallbacks<Extra = {}> {
	enrichUser: (user: User) => Promise<User & Extra>;
	onUserCreated?: (user: User) => Promise<void> | void;
	onUserUpdated?: (user: User) => Promise<void>;
	onUserDeleted?: (user: User) => Promise<void>;
}

export function createAuthCallbacks<
	Fn extends (user: User) => Promise<User & Record<string, any>>,
	Extra = Fn extends (user: User) => Promise<infer R>
		? Omit<R, keyof User>
		: never
>(callbacks: {
	enrichUser: Fn;
	onUserCreated?: (user: User) => Promise<void>;
	onUserUpdated?: (user: User) => Promise<void>;
	onUserDeleted?: (user: User) => Promise<void>;
}): AuthNCallbacks<Extra> {
	return callbacks as AuthNCallbacks<Extra>;
}

const cb = createAuthCallbacks({
	enrichUser: async (user) => {
		return {
			...user,
			role: "user",
			team: "Engineering",
		};
	},
	onUserCreated: async () => {
		console.log("");
	},
	onUserUpdated: async () => {
		console.log("");
	},
	onUserDeleted: async () => {
		console.log("");
	},
});

async function test2() {
	const enrichedUser2 = await cb.enrichUser({
		id: "123",
		name: "John Doe",
		email: "john.doe@example.com",
		image: null,
	});
	console.log("using createCallbacks:", enrichedUser2.role); // This is typed
}

// --- Level 3 the AuthManager Level
export type InferExtraFromCallbacks<T extends AuthNCallbacks<any>> =
	T extends AuthNCallbacks<infer U> ? U : never;

export type JwtConfig = {
	jwt: string;
};

export type SessionConfig = {
	session: string;
};

export interface AuthConfigBase<Extra> {
	callbacks: AuthNCallbacks<Extra>;
}

export interface IAuthManager<Extra> {
	callbacks: AuthNCallbacks<Extra>;
}

export function createAuthManager<
	CB extends AuthNCallbacks<any>,
	Extra = InferExtraFromCallbacks<CB>
>(
	config: Omit<AuthConfigBase<Extra>, "callbacks"> & {
		callbacks: CB;
	} & (
			| { strategy: "jwt"; jwtConfig: JwtConfig }
			| { strategy: "session"; sessionConfig: SessionConfig }
		)
): IAuthManager<Extra> {
	return AuthManager(config.callbacks);
}

const AuthManager = <Extra>(callbacks: AuthNCallbacks<Extra>) => {
	return {
		callbacks,
	};
};

const test3 = async () => {
	const authManager = createAuthManager({
		callbacks: cb,
		strategy: "jwt",
		jwtConfig: {
			jwt: "hello",
		},
	});
	const enrichedUser = await authManager.callbacks.enrichUser({
		id: "123",
		name: "John Doe",
		email: "john.doe@example.com",
		image: null,
	});
	console.log("Using createAuthManager: ", enrichedUser.team);
};

test1();
test2();
test3();
