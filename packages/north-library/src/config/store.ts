// src/config/store.ts
// This file only handles storing and retrieving config
import type { AuthConfig } from "../types/config";

let cachedAuthConfig: AuthConfig | null = null;

// export function setAuthConfig(config: AuthConfig) {
// 	cachedAuthConfig = config;
// }

// export function getAuthConfig(): AuthConfig {
// 	if (!cachedAuthConfig) {
// 		throw new Error(
// 			"Authentication not initialized. Call initAuth() first."
// 		);
// 	}
// 	return cachedAuthConfig;
// }
