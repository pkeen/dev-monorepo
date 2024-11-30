import { password as authPassword } from "@/lib/auth/utils";
import { validate } from "@/lib/auth/actions/signin/validate";
import { findUserByEmail } from "@/lib/auth/db/queries";
import { AuthResponse } from "@/lib/auth/utils";
import { generateCsrf } from "@/lib/auth/utils/csrf";
import { token } from "@/lib/auth/utils";
import type { AuthConfig } from "../config";

export async function POST(req: Request, authConfig: AuthConfig) {
	try {
		console.log("signing in");
		// Step 1: Validate input
		const { email, password } = validate(await req.json());

		// Step 2: Find user by email
		const user = await findUserByEmail(email);
		if (!user) {
			throw new Error("User not found");
		}

		// Step 3: Verify password
		if (!user.password) {
			throw new Error("User password is missing");
		}
		const isAuthenticated = await authPassword.verify(
			password,
			user.password
		);
		if (!isAuthenticated) {
			// return NextResponse.json(
			// 	{ message: "Invalid credentials" },
			// 	{ status: 401 }
			// );
			throw new Error("Invalid credentials");
		}

		// Step 4: Sign Refresh Token
		const refreshToken = await token.sign("refresh", {
			id: user.id,
			email: user.email,
		});

		// Step 4: Sign Access Token
		const accessToken = await token.sign("access", {
			id: user.id,
			email: user.email,
		});

		// Step 5: create a csrf token
		const csrf = generateCsrf();

		// Step 6: Create an AuthResponse with a cookie and csrf
		const res = AuthResponse.withJson(
			{ message: "Sign in successful", accessToken, csrf }, // add csrf to the response
			{ status: 201 }
		);
		// setCookie will need rewriting to contain naming
		// res.setCookie(refreshToken);
		res.setAccess(accessToken);
		res.setRefresh(refreshToken);
		res.setCsrf(csrf);
		return res;
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "An error occurred";

		return AuthResponse.withCookie({
			cookie: "",
			json: { message: errorMessage },
			status: 500,
			cookieOptions: {
				maxAge: 0, // deletes old cookie
			},
		});
	}
}
