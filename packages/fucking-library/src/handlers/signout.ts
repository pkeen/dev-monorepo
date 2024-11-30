import { AuthResponse } from "@utils";
import type { AuthConfig } from "../config";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest, authConfig: AuthConfig) {
	try {
		const response = AuthResponse.withJson({ message: "Signed out" });
		// Destroy the refresh token
		response.destroyRefresh();
		response.destroyAccess();
		response.destroyCsrf();
		return response;
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "An error occurred";
		return AuthResponse.withError(errorMessage);
	}
}
