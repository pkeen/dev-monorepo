import type { AuthConfig } from "./config";
import { AuthConfigSchema } from "./config";

let authConfig: AuthConfig | null = null;

export function initAuth(userConfig: Partial<AuthConfig>) {
	const validatedConfig = AuthConfigSchema.parse({
		...userConfig, // User-provided config
	});

	authConfig = validatedConfig;
	return authConfig;
}

// Getter for the configuration
export function getAuthConfig(): AuthConfig {
	if (!authConfig) {
		throw new Error(
			"Authentication not initialized. Call initAuth() first."
		);
	}
	return authConfig;
}
