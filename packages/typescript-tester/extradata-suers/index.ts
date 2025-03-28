// ------------------------------------------------
// 1) Basic types
// ------------------------------------------------
export interface User {
	id: string;
	email?: string;
}

export interface AuthNCallbacks<Extra = {}> {
	enrichUser: (user: User) => Promise<User & Extra>;
	onUserCreated?: (user: User) => Promise<void>;
	onUserDeleted?: (user: User) => Promise<void>;
}

export interface IAuthManager<Extra = {}> {
	doSomething: () => Promise<User & Extra>;
}

// ------------------------------------------------
// 2) buildAuthZ: Returns object with typed enrichUser
// ------------------------------------------------
export async function buildAuthZ() {
	type MyEnrichedData = { role: string };

	async function enrichUser(base: User): Promise<User & MyEnrichedData> {
		return { ...base, role: "admin" };
	}
	return {
		enrichUser,
		onUserCreated: async (u: User) => {
			/* ... */
		},
		onUserDeleted: async (u: User) => {
			/* ... */
		},
	};
}

// ------------------------------------------------
// 3) createAuthCallbacks: Overloads or single union
// ------------------------------------------------
// Overload 1: Accept an authz object
export function createAuthCallbacks<MergedData>(authz: {
	enrichUser: (user: User) => Promise<User & MergedData>;
	onUserCreated?: (u: User) => Promise<void>;
	onUserDeleted?: (u: User) => Promise<void>;
}): AuthNCallbacks<MergedData>;

// Overload 2: Accept a plain AuthNCallbacks
export function createAuthCallbacks<Extra>(
	cb: AuthNCallbacks<Extra>
): AuthNCallbacks<Extra>;

// Actual Implementation
export function createAuthCallbacks<Extra>(
	input:
		| AuthNCallbacks<Extra>
		| {
				enrichUser: (user: User) => Promise<User & Extra>;
				onUserCreated?: (u: User) => Promise<void>;
				onUserDeleted?: (u: User) => Promise<void>;
		  }
): AuthNCallbacks<Extra> {
	return {
		onUserCreated: async () => {},
		onUserDeleted: async () => {},
		enrichUser: async (u: User) => u as User & Extra,
		...input,
	};
}

// ------------------------------------------------
// 4) createAuthManager that returns IAuthManager<Extra>
// ------------------------------------------------
export function createAuthManager<Extra>(
	callbacks: AuthNCallbacks<Extra>
): IAuthManager<Extra> {
	return {
		async doSomething() {
			// Just a demonstration:
			if (callbacks.enrichUser) {
				return callbacks.enrichUser({ id: "123" });
			}
			return { id: "123" } as User & Extra;
		},
	};
}

// ------------------------------------------------
// 5) Putting it all together - DEMO
// ------------------------------------------------
async function demo() {
	// 1) Build authz
	const authz = await buildAuthZ();
	// 2) Create callbacks from authz
	//    Here the overload should detect your MergedData type automatically
	const cb = createAuthCallbacks(authz);

	// Let's test it:
	type DebugCB = Awaited<ReturnType<typeof cb.enrichUser>>;
	// Hover DebugCB => { id: string; email?: string | undefined; role: string; }

	// 3) Create the auth manager, telling it the ExtraData
	const authManager =
		createAuthManager<
			Awaited<ReturnType<typeof cb.enrichUser>> extends infer R
				? Omit<R, keyof User>
				: never
		>(cb);

	// Or simpler if you know the shape is just { role: string }:
	// const authManager = createAuthManager<{ role: string }>(cb);

	// 4) Finally do something with your auth manager
	const result = await authManager.doSomething();
	// Hover result =>  (property) role: string

	console.log("Result user:", result);
}

demo();
