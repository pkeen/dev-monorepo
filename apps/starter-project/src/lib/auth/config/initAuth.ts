import type { AuthConfig } from "./config";
import { NextRequest, NextResponse } from "next/server";
import { AuthConfigSchema } from "./config";
import * as Handlers from "../handlers";

// ask about lazy dnynamic config
// perhaps better if expanding to multi-tenant

type LazyAuthConfig = (req?: NextRequest) => Promise<AuthConfig> | AuthConfig;

interface AuthenticatedRequest extends NextRequest {
	auth?: {
		config: AuthConfig;
	};
}

let cachedAuthConfig: AuthConfig | null = null;

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
		if (!cachedAuthConfig || typeof config === "function") {
			cachedAuthConfig = await getConfig(req);
		}
		return cachedAuthConfig;
	}

	// Middleware: Attaches auth info to the request
	const auth = async (req: AuthenticatedRequest, res: NextResponse) => {
		const authConfig = await loadConfig(req);
		req.auth = { config: authConfig };
		return req;
	};

	// Dynamically create handlers
	const handlers: Record<string, any> = {};

	for (const [route, methods] of Object.entries(Handlers)) {
		handlers[route] = {};
		for (const [method, handler] of Object.entries(methods)) {
			handlers[route][method] = async (req: NextRequest) => {
				const authConfig = await loadConfig(req);
				return handler(req, authConfig); // Pass authConfig to the handler
			};
		}
	}

	// // Handlers: Provide API route logic grouped by route and method
	// const handlers = {
	// 	signin: {
	// 		POST: async (req: NextRequest) => {
	// 			const authConfig = await loadConfig(req);
	// 			return NextResponse.json({
	// 				message: "Sign-in handler",
	// 				authConfig,
	// 			});
	// 		},
	// 	},
	// 	signout: {
	// 		POST: async (req: NextRequest) => {
	// 			const authConfig = await loadConfig(req);
	// 			return NextResponse.json({
	// 				message: "Sign-out handler",
	// 				authConfig,
	// 			});
	// 		},
	// 	},
	// 	refresh: {
	// 		POST: async (req: NextRequest) => {
	// 			const authConfig = await loadConfig(req);
	// 			return Handlers.refresh.POST(req, authConfig);
	// 		},
	// 	},
	// 	csrf: {
	// 		GET: async (req: NextRequest) => {
	// 			const authConfig = await loadConfig(req);
	// 			return csrfRoutes.GET(req, authConfig);
	// 			// const csrfToken = csrf.generateToken(); // Replace with your CSRF logic
	// 			// return NextResponse.json({ csrfToken });
	// 		},
	// 		POST: async (req: NextRequest) => {
	// 			const authConfig = await loadConfig(req);
	// 			return csrfRoutes.POST(req, authConfig);
	// 		},
	// 	},
	// 	helloworld: {
	// 		GET: async () => {
	// 			return NextResponse.json({ message: "Hello World" });
	// 		},
	// 	},
	// };

	return { handlers, auth };
	// authConfig = validatedConfig;
	// console.log(authConfig);
	// return authConfig;
};

// Getter for the configuration
export function getAuthConfig(): AuthConfig {
	if (!cachedAuthConfig) {
		throw new Error(
			"Authentication not initialized. Call initAuth() first."
		);
	}
	return cachedAuthConfig;
}
