import { AuthResponse } from "@main";

export async function POST() {
	try {
		const response = AuthResponse.withJson({ message: "Signed out" });
		// Destroy the refresh token
		response.destroyCookie();
		response.destroyCsrf();
		return response;
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "An error occurred";
		return AuthResponse.withError(errorMessage);
	}
}
