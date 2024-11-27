import { generateCsrf } from "@/lib/auth/utils/csrf";
import { AuthResponse } from "@/lib/auth/utils";
import { NextRequest } from "next/server";
import AuthConfig from "@/lib/auth/config";

export async function GET() {
	const csrf = generateCsrf();

	const res = AuthResponse.withJson({ csrf });

	res.setCsrf(csrf);

	return res;
}

export async function POST(req: NextRequest) {
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
