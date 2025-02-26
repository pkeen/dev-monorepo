import { AuthError } from "../error";
import { User } from "../auth-system/index.types";

/*
 The Core Types for the library
*/

// Basic return type for Authentication functions
export type AuthState =
	| { authenticated: true; user: User; keyCards: KeyCards }
	| { authenticated: false; user: null; keyCards: null; error?: AuthError };

// Define specific result types
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

// Core interfaces that other components must implement

// // This adapter handles the specifics of how tokens are stored in a web browser
// export interface WebStorageAdapter {
// 	storeTokens: (tokens: AuthTokens) => Promise<void>;
// 	getStoredTokens: () => Promise<AuthTokens | null>;
// 	clearTokens: () => Promise<void>;
// 	getCookieHeaders: (tokens: AuthTokens) => Record<string, string[]>;
// 	getRemovalHeaders: () => Record<string, string[]>;
// }

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

export * from "./UserRegistry";
