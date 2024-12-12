// export interface PublicUser {
// 	id: number;
// 	email: string;
// 	// roles: string[];
// }

import { SignJWT } from "jose";

export interface User {
	id: string;
	name?: string | null;
	email: string;
	image?: string | null;
}

export interface Resource {
	ownerId: number;
	status: string;
}

export type Credentials = {
	email: string;
	password: string;
};

export type AuthResult = {
	success: boolean;
	authState?: AuthState;
};

export interface AuthManager {
	authenticate: (credentials: Credentials) => Promise<AuthResult>;
	// can: (user: User, action: string, resource: Resource) => boolean;
	// storageAdapter: WebStorageAdapter;
	signup: (credentials: Credentials) => Promise<AuthState>;
	validate: (authState: AuthState) => Promise<AuthValidationResult>;
	// refreshToken: (refreshToken: string) => Promise<AuthResult>;
	logout: (request: Request, response: Response) => Promise<void>;
	refresh: (authState: AuthState) => Promise<AuthState>;
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
	logout(tokenOrSessionId: string): Promise<void>;
	validate(authState: AuthState): Promise<AuthValidationResult>;
	supportsRefresh(): boolean;
	refresh(authState: AuthState): Promise<AuthState>;
	signup(credentials: Credentials): Promise<AuthState>;
	// revoke(token: string): Promise<void>; could support revoking
}

export * from "./UserRegistry";
