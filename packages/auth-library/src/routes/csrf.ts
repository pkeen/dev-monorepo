import { csrf as Csrf } from "@utils";
import { AuthResponse } from "@utils";
import { NextRequest } from "next/server";
import { getAuthConfig } from "@config";

export async function GET() {
	// const csrf = utils.generateCsrf();
	const csrf = Csrf.generate();

	const res = AuthResponse.withJson({ csrf });

	res.setCsrf(csrf);

	return res;
}

export async function POST(req: NextRequest) {
	const AuthConfig = getAuthConfig();
	try {
		// Client-sent token from headers
		const clientToken = req.headers.get("csrf-token");
		// Server-stored token (e.g., HTTP-only cookie)
		const serverToken = req.cookies.get(
			`${AuthConfig.cookies.namePrefix}-csrf`
		)?.value;

		if (!clientToken || clientToken !== serverToken) {
			throw new Error("Invalid CSRF token");
		}

		return AuthResponse.withJson({ message: "CSRF token verified" });
	} catch (error) {
		console.error("error:", error);
		return AuthResponse.withError({ message: "Invalid CSRF token" });
	}
}
