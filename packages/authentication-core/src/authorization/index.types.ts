export interface AuthzData {
	roles?: string[];
	permissions?: string[];
	[key: string]: any;
}

export interface Authz {
	seed: () => void;
	enrichToken?: (userId: string) => Promise<AuthzData>;
	createUserRole?: (userId: string, role?: string) => Promise<void>;
	updateUserRole?: (userId: string, role?: string) => Promise<void>;
}
