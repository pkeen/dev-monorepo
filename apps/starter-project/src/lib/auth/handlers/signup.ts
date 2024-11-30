import { password as authPassword } from "@/lib/auth/utils";
import { findUserByEmail, insertUserAndReturnIt } from "@/lib/auth/db/queries";
import { validate } from "@/lib/auth/actions/signup/validate";
import { token } from "@/lib/auth/utils";
import { AuthResponse } from "@/lib/auth/utils";
import { generateCsrf } from "@/lib/auth/utils/csrf";

export async function POST(req: Request) {
	try {
		// Step 1: Validate input
		const { name, email, password } = validate(await req.json());

		// Step 2: Check if user already exists
		const existingUser = await findUserByEmail(email);
		if (existingUser) {
			throw new Error("An account with that email is already registered");
		}

		// Step 3: Hash the password
		const hashedPassword = await authPassword.hash(password);

		// Step 4: Insert the new user
		let user;
		try {
			user = await insertUserAndReturnIt({
				name,
				email,
				password: hashedPassword,
			});
		} catch (err) {
			console.error(err);
			throw new Error("Error inserting user");
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

		// Step 6: create a csrf token
		const csrf = generateCsrf();

		// Step 7: Create an AuthResponse with a cookie and csrf
		const res = AuthResponse.withJson(
			{ message: "Sign in successful", accessToken, csrf }, // add csrf to the response
			{ status: 201 }
		);
		res.setAccess(accessToken);
		res.setRefresh(refreshToken);
		res.setCsrf(csrf);
	} catch (err) {
		const errorMessage =
			err instanceof Error ? err.message : "An error occurred";

		return AuthResponse.withCookie({
			cookie: "",
			json: { message: errorMessage },
			status: 500,
			cookieOptions: {
				maxAge: 0,
			},
		});
	}
}
