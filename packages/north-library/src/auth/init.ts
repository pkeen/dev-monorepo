// src/auth/init.ts
import { resolveConfig } from "../config/init";
import { setAuthConfig } from "../config/store";
import { createHandlers } from "./createHandlers";
// import { createMiddleware } from "../middleware";
import type { AuthConfig, LazyAuthConfig } from "../types/config";
import { AuthConfigSchema } from "../schemas";

export async function initAuth(config: AuthConfig) {
	// Resolve and validate the configuration
	// const initialConfig = await resolveConfig(config);

	const initialConfig = AuthConfigSchema.parse(config);

	// Store it in our singleton store
	// setAuthConfig(initialConfig);

	// Create handlers and middleware using this configuration
	return {
		handlers: createHandlers(initialConfig),
		// middleware: createMiddleware(initialConfig),
	};
}
