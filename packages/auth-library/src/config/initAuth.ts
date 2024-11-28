import type { AuthConfig } from "./config";
import { NextRequest, NextResponse } from "next/server";
import { AuthConfigSchema } from "./config";

let authConfig: AuthConfig | null = null;

// ask about lazy dnynamic config
// perhaps better if expanding to multi-tenant

type LazyAuthConfig = (req?: NextRequest) => Promise<AuthConfig> | AuthConfig;

let cachedConfig: AuthConfig | null = null;

export const initAuth = async (
	config: AuthConfig | LazyAuthConfig
): Promise<{ handlers: any; auth: any }> => {
	// get config and validate it
	const getConfig = async (req?: NextRequest): Promise<AuthConfig> => {
		const resolvedConfig =
			typeof config === "function" ? await config(req) : config;

		// Validate the config
		const validatedConfig = AuthConfigSchema.parse(resolvedConfig);
		return validatedConfig;
	};

	async function loadConfig(req?: NextRequest): Promise<AuthConfig> {
		if (!cachedConfig || typeof config === "function") {
			cachedConfig = await getConfig(req);
		}
		return cachedConfig;
	}

    
	//    // Middleware: Attaches auth info to the request
	//   const auth = async (req: NextRequest, res: NextResponse) => {
	//     const authConfig = await loadConfig(req);
	//     req.auth = { config: authConfig };
	//     return req;
	//   };

	// 	const validatedConfig = AuthConfigSchema.parse(config);
	//   // Handlers: Provide API route logic
	//   const handlers = {
	//     async signin(req: NextRequest) {
	//       const authConfig = await loadConfig(req);
	//       return NextResponse.json({ message: "Sign-in handler", authConfig });
	//     },
	//     async signout(req: NextRequest) {
	//       const authConfig = await loadConfig(req);
	//       return NextResponse.json({ message: "Sign-out handler", authConfig });
	//     },
	//   };

	// return { handlers, auth };
	// authConfig = validatedConfig;
	// console.log(authConfig);
	// return authConfig;
};

// Getter for the configuration
export function getAuthConfig(): AuthConfig {
	if (!authConfig) {
		throw new Error(
			"Authentication not initialized. Call initAuth() first."
		);
	}
	return authConfig;
}
