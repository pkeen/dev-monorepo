import { AuthConfigSchema } from "schemas/config";
import type { AuthConfig, LazyAuthConfig } from "types/config";
import { NextRequest, NextResponse } from "next/server";

// ask about lazy dnynamic config
// perhaps better if expanding to multi-tenant

export async function resolveConfig(
	config: AuthConfig | LazyAuthConfig,
	req?: NextRequest
): Promise<AuthConfig> {
	const resolvedConfig =
		typeof config === "function" ? await config(req) : config;

	return AuthConfigSchema.parse(resolvedConfig);
}
