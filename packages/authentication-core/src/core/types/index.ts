import { AuthError } from "../error";
import { User } from "../auth-system/index.types";
import { Adapter } from "core/adapter";
import { AuthProvider } from "core/providers";
// import { Authz } from "authorization/index.types";
import { JwtConfig } from "core/session-strategy/jwt-strategy/index.types";
import { SessionConfig } from "core/session-strategy/db-strategy/index.types";

/*
 The Core Types for the library
*/

// Basic return type for Authentication functions
export type AuthState =
	| { authenticated: true; user: User; keyCards: KeyCards }
	| { authenticated: false; user: null; keyCards: null; error?: AuthError };

// Define specific result types
// Not sure this is needed anymore
export type RedirectResult = {
	type: "redirect";
	url: string;
	state?: string;
};

export type SuccessResult = {
	type: "success";
	authState: AuthState;
};

export type ErrorResult = {
	type: "error";
	error: AuthError;
};

export type RefreshResult = {
	type: "refresh";
	authState: AuthState;
};

export type AuthResult =
	| SuccessResult
	| ErrorResult
	| RedirectResult
	| RefreshResult;

export interface AuthStrategy {
	name: string;
	createKeyCards(user: User): Promise<KeyCards>;
	logout(keyCards: KeyCards): Promise<AuthState>;
	validate(keyCards: KeyCards): Promise<AuthResult>;
	// validateCard(keyCards: KeyCards, name: string): Promise<AuthResult>;
	// validateAll(keyCards: KeyCards): Promise<AuthValidationResult>;
	// validateRefresh?(keyCards: KeyCards): Promise<AuthValidationResult>;
	supportsRefresh(): boolean;
	// signup(credentials: Credentials): Promise<KeyCards>;
	// revoke(token: string): Promise<void>; could support revoking
}

export interface KeyCard {
	name: string;
	value: string;
	expiresAt?: Date;
	type?: "access" | "refresh" | "session";
	storageOptions?: CookieOptions;
}

export interface CookieOptions {
	httpOnly?: boolean;
	secure?: boolean;
	sameSite?: "strict" | "lax" | "none";
	maxAge?: number;
	path?: string;
}

export type KeyCards = KeyCard[];

export interface UserPublic {
	id: string;
	name?: string | null;
	email: string;
	image?: string | null;
	// TODO: add roles
}

export interface UserAccountProfile {
	accountId: string;
	name?: string | null;
	email: string;
	image?: string | null;
}
// export interface SessionElement {
// 	name: string;
// 	value: string;
// 	expiresAt?: Date;
// 	type?: "access" | "refresh" | "session";
// 	sessionStorageOptions: CookieOptions;
// }

// export type SessionElements = SessionElement[];

// export type ImprovedSessionState = {
// 	sessionElements: SessionElements;
// };

export interface DatabaseUser {
	id: string;
	name?: string | null;
	email: string;
	emailVerified?: Date | null;
	image?: string | null;
	// password?: string;
}

export interface Resource {
	ownerId: string;
	status: string;
}

export interface CsrfOptions {
	cookieName?: string;
	headerName?: string;
	tokenLength?: number;
}

export interface VerifyResult {
	valid: boolean;
	user?: User; // Populated on success
	reason?: string; // Human-readable reason for failure
	code?: string; // Machine-readable error code (e.g., "expired_token", "invalid_signature")
}

export type ProviderName = "google" | "github" | "facebook";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface Logger {
	// The current threshold (anything below this won’t log)
	level: LogLevel;

	debug: (message: string, meta?: Record<string, unknown>) => void;
	info: (message: string, meta?: Record<string, unknown>) => void;
	warn: (message: string, meta?: Record<string, unknown>) => void;
	error: (message: string, meta?: Record<string, unknown>) => void;
}

export interface LoggerOptions {
	level?: LogLevel;
	prefix?: string;
	// filepath?: string; // If they want file logging
	silent?: boolean; // Disable console logging
	// format?: LogFormat; // Log format
}

interface AuthConfigBase<T extends Record<string, any> = {}> {
	adapter?: Adapter;
	logger?: Logger;
	loggerOptions?: LoggerOptions;
	providers?: AuthProvider[]; // TODO: Make this an array of provider options
	// authz?: Authz;
	callbacks?: AuthNCallbacks<T>;
	// passwordService?: string;
}

export type AuthConfig =
	| (AuthConfigBase & { strategy: "jwt"; jwtConfig: JwtConfig })
	| (AuthConfigBase & { strategy: "session"; sessionConfig: SessionConfig });

// Ensure T is always an object type
type EnrichedUser<T extends Record<string, any> = {}> = User & T;

export interface AuthNCallbacks<T extends Record<string, any> = {}> {
	/**
	 * Called after a new user is created.
	 * Can be used to initialize default AuthZ data (e.g., roles/permissions).
	 */
	onUserCreated?: (user: User) => Promise<void> | void;

	/**
	 * Called after a user is updated.
	 * Can be used to update default AuthZ data (e.g., roles/permissions).
	 */
	onUserUpdated?: (user: User) => void;

	/**
	 * Called after a user is deleted.
	 * Can be used to clean up default AuthZ data (e.g., roles/permissions).
	 */
	onUserDeleted?: (userId: string) => void;

	/**
	 * Called when a user is retrieved from the database.
	 * Allows enrichment with roles/permissions before being returned or added to a JWT.
	 */
	enrichUser?: (user: User) => Promise<EnrichedUser<T>>;
}

// export interface AuthzData {
// 	roles?: string[];
// 	permissions?: string[];
// 	[key: string]: any;
// }

// export interface Authz {
// 	name: string;
// 	seed: () => void;
// 	enrichToken?: (userId: string) => Promise<AuthzData>;
// 	createUserRole?: (userId: string, role?: string) => Promise<void>;
// 	updateUserRole?: (userId: string, role?: string) => Promise<void>;
// }

export * from "./UserRegistry";
