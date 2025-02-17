import { LogLevel } from "@pete_keen/logger";
import { Adapter, AdapterUser } from "../adapter";
import { JwtConfig } from "../strategy/jwt-strategy/index.types";
import { SessionConfig } from "../strategy/session-strategy/index.types";
import { ProviderOptions } from "../providers/index.types";
import {
	Credentials,
	SignupCredentials,
} from "../providers/credentials/index.types";
import { AuthState, KeyCards } from "../types";
import { AuthProvider } from "../providers/OAuth/oauth-provider";
import { Role } from "../roles/index.types";

export interface LoggerOptions {
	level?: LogLevel;
	filepath?: string; // If they want file logging
	silent?: boolean; // Disable console logging
	// format?: LogFormat; // Log format
}

export interface AuthConfigBase {
	adapter?: Adapter;
	// passwordService?: string;
	logger?: LoggerOptions;
	providers?: AuthProvider; // TODO: Make this an array of provider options
}

export type AuthConfig =
	| (AuthConfigBase & { strategy: "jwt"; jwtConfig: JwtConfig })
	| (AuthConfigBase & { strategy: "session"; sessionConfig: SessionConfig });

/*
Base User interface
*/
export interface User {
	id: string;
	name?: string | null;
	email: string;
	image?: string | null;
	role?: Role;
}

export interface IAuthSystem {
	// authenticate: (credentials: Credentials) => Promise<ImprovedAuthState>;
	authenticate: (credentials: Credentials) => Promise<AuthState>;
	// can: (user: User, action: string, resource: Resource) => boolean;
	// storageAdapter: WebStorageAdapter;
	signin: (provider: string) => Promise<AuthState>;

	signup: (credentials: SignupCredentials) => Promise<AuthState>;
	validate: (keyCards: KeyCards) => Promise<AuthState>;
	// refreshToken: (refreshToken: string) => Promise<AuthResult>;
	logout: (keyCards: KeyCards) => Promise<AuthState>;
	// refresh: (keyCards: KeyCards) => Promise<ImprovedAuthState>;
}
