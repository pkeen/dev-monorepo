import * as Handlers from "../handlers";
import { NextRequest } from "next/server";
import type { AuthConfig } from "../types/config";

export const createHandlers = (config: AuthConfig) => {
	// Dynamically create handlers
	const handlers: Record<string, any> = {};

	for (const [route, methods] of Object.entries(Handlers)) {
		handlers[route] = {};
		for (const [method, handler] of Object.entries(methods)) {
			handlers[route][method] = async (req: NextRequest) => {
				// const authConfig = await resolveConfig(config, req); // Resolve the config(req);
				return handler(req, config); // Pass authConfig to the handler
			};
		}
	}

	return handlers;
};
