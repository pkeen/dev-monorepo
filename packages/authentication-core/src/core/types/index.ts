// export interface PublicUser {
// 	id: number;
// 	email: string;
// 	// roles: string[];
// }

// Base token type with common properties
export interface AuthToken {
	value: string;
	expiresAt?: Date;
	name?: string;
}

// All possible token types in the system
export interface AuthTokens {
	accessToken?: AuthToken;
	refreshToken?: AuthToken;
	sessionId?: AuthToken;
	csrfToken?: AuthToken;
}

export interface User {
	id: string;
	name?: string | null;
	email: string;
	image?: string | null;
}

export interface Resource {
	ownerId: string;
	status: string;
}

export interface Credentials {
	email: string;
	password: string;
}

export interface SignupCredentials extends Credentials {
	name: string;
}

export type AuthResult = {
	success: boolean;
	authState?: AuthState;
};

export interface AuthManager {
	authenticate: (credentials: Credentials) => Promise<ImprovedAuthState>;
	// can: (user: User, action: string, resource: Resource) => boolean;
	// storageAdapter: WebStorageAdapter;
	signup: (credentials: SignupCredentials) => Promise<ImprovedAuthState>;
	validate: (authState: AuthState) => Promise<AuthValidationResult>;
	// refreshToken: (refreshToken: string) => Promise<AuthResult>;
	logout: (authState: ImprovedAuthState) => Promise<void>;
	refresh: (authState: AuthState) => Promise<ImprovedAuthState>;
}

// Core interfaces that other components must implement

// Core token service interface
export interface TokenService {
	generate: (user: User, options: JwtOptions) => Promise<string>;
	verify: (
		token: string,
		options: JwtOptions
	) => Promise<AuthValidationResult>;
	revoke: (token: string) => Promise<void>;
	// refresh: (refreshToken: string) => Promise<TokenResponse>;
}

// This adapter handles the specifics of how tokens are stored in a web browser
export interface WebStorageAdapter {
	storeTokens: (tokens: AuthTokens) => Promise<void>;
	getStoredTokens: () => Promise<AuthTokens | null>;
	clearTokens: () => Promise<void>;
	getCookieHeaders: (tokens: AuthTokens) => Record<string, string[]>;
	getRemovalHeaders: () => Record<string, string[]>;
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

// The complete auth state
export interface ImprovedAuthState {
	isLoggedIn: boolean;
	// The authenticated user
	user?: User;

	// Active tokens
	tokens?: AuthTokens;

	// When the auth state was created
	createdAt?: Date;

	// When the entire auth state expires (might differ from individual token expiry)
	expiresAt?: Date;

	// The strategy that created this state
	strategy?: "jwt" | "session";

	// Optional metadata that might be needed by specific strategies
	metadata?: Record<string, unknown>;
}

export interface JwtOptions {
	key: string;
	secretKey: string;
	algorithm: string;
	expiresIn: string;
	fields?: string[];
}

export interface JwtConfig {
	access: JwtOptions;
	refresh: JwtOptions;
}

export interface AuthValidationResult {
	valid: boolean;
	user?: User; // Populated if validation succeeded and we could derive a user
	reason?: string; // Human-readable explanation of why validation failed
	code?: string; // Machine-readable error code (e.g., "expired", "invalid_signature", "session_not_found")
	expiresAt?: number; // Optional, e.g., for JWT to indicate expiration time
}

export interface VerifyResult {
	valid: boolean;
	user?: User; // Populated on success
	reason?: string; // Human-readable reason for failure
	code?: string; // Machine-readable error code (e.g., "expired_token", "invalid_signature")
}

export interface AuthStrategy {
	createAuthState(
		user: User
		// userId: string,
		// roles: string[]
	): Promise<AuthState>;
	createAuthTokens(user: User): Promise<AuthTokens>;
	logout(tokenOrSessionId: string): Promise<void>;
	validate(authState: AuthState): Promise<AuthValidationResult>;
	supportsRefresh(): boolean;
	refresh(authState: AuthState): Promise<AuthState>;
	signup(credentials: Credentials): Promise<AuthState>;
	// revoke(token: string): Promise<void>; could support revoking
}

export * from "./UserRegistry";
