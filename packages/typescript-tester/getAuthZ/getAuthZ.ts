// Perhaps because im having so much trouble with the enrich user types I should just try a returtn only authz data
// a function to insert additional data

const authz = {
	getAuthZ: (userId: string) => {
		return {
			role: "admin",
			team: "engineering",
		};
	},
};

interface User {
	id: string;
	name: string;
}

type GetExtraUserData<Extra> = (userId: string) => Promise<Extra>;

interface AuthNCallbacks<Extra = {}> {
	getExtraUserData: GetExtraUserData<Extra>;
	onUserCreated?: (user: User) => Promise<void>;
	onUserUpdated?: (user: User) => Promise<void>;
	onUserDeleted?: (user: User) => Promise<void>;
}

export function createAuthCallbacks<Extra>(callbacks: AuthNCallbacks<Extra>) {
	return callbacks;
}

const cb = createAuthCallbacks({
	getExtraUserData: async (userId: string) => {
		return { role: "admin", team: "engineering" };
	},
});

const test1 = async () => {
	const user: User = { id: "sfds", name: "johan" };
	const authzData = await cb.getExtraUserData("sdfjhsdkf");
	const enrichedUser = { ...user, ...authzData };
	console.log(enrichedUser.team);
};

test1();

// const GetAuthz = authz.getAuthZ("sdfjds");
