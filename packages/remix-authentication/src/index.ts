export const hello = () => {
	return "hello world";
};

import { AuthConfig } from "@pete_keen/authentication-core";

// App-specific config extension
export interface ExtendedAuthConfig {
	redirectAfterLogin?: string;
	redirectAfterLogout?: string;
}

// Combined configuration for dependency injection
export type AppAuthConfig = AuthConfig & ExtendedAuthConfig;
