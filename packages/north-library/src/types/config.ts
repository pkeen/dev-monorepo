// src/types/config.ts
import type { z } from "zod";
import type { AuthConfigSchema } from "../schemas/config";
import type { NextRequest } from "next/server";

// Export the inferred type from the schema
export type AuthConfig = z.infer<typeof AuthConfigSchema>;

export type LazyAuthConfig = (
	req?: NextRequest
) => Promise<AuthConfig> | AuthConfig;

export interface AuthenticatedRequest extends NextRequest {
	auth?: {
		config: AuthConfig;
	};
}

// Export specific parts that users might need
export type JWTOptions = AuthConfig["jwtOptions"];
export type CookieOptions = AuthConfig["cookies"];
