export interface User {
	id: number;
	email: string;
	// roles: string[];
}

export interface Resource {
	ownerId: number;
	status: string;
}

export type Credentials = {
	email: string;
	password: string;
};

export interface AuthManager {
	authenticate: (credentials: Credentials) => Promise<AuthResult>;
	// can: (user: User, action: string, resource: Resource) => boolean;
	// storageAdapter: WebStorageAdapter;

	// validateToken: (token: string) => Promise<User | null>;
	// refreshToken: (refreshToken: string) => Promise<AuthResult>;
	logout: (request: Request, response: Response) => Promise<void>;
}

// Core interfaces that other components must implement
export interface UserRepository {
	findByEmail: (email: string) => Promise<User | null>;
	findById: (id: string) => Promise<User | null>;
	create: (user: CreateUserDTO) => Promise<User>;
	update: (id: string, data: UpdateUserDTO) => Promise<User>;
}

export interface TokenService {
	generate: (user: User, config: JwtConfig) => Promise<AuthState>;
	// verify: (token: string) => Promise<User | null>;
	// revoke: (token: string) => Promise<void>;
}

// This adapter handles the specifics of how tokens are stored in a web browser
export interface WebStorageAdapter {
	storeTokens: (tokens: AuthTokens) => Promise<void>;
	getStoredTokens: () => Promise<AuthTokens | null>;
	clearTokens: () => Promise<void>;
	getCookieHeaders: (tokens: AuthTokens) => Record<string, string[]>;
	getRemovalHeaders: () => Record<string, string[]>;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
	csrfToken: string;
}

export interface CookieOptions {
	httpOnly?: boolean;
	secure?: boolean;
	sameSite?: "strict" | "lax" | "none";
	maxAge?: number;
	path?: string;
}

export interface CsrfOptions {
	cookieName?: string;
	headerName?: string;
	tokenLength?: number;
}

export interface AuthState {
	accessToken?: string;
	refreshToken?: string;
	sessionId?: string;
}

export interface AuthStrategy {
	createAuthState(
		user: User
		// userId: string,
		// roles: string[]
	): Promise<AuthState>;
	logout(tokenOrSessionId: string): Promise<void>;
	validate(tokenOrSessionId: string): Promise<User | null>;
}

export interface JwtConfig {
	access: {
		key: string;
		secretKey: string;
		algorithm: string;
		expiresIn: string;
		fields?: string[];
	};
	refresh: {
		key: string;
		secretKey: string;
		algorithm: string;
		expiresIn: string;
		fields?: string[];
	};
}
