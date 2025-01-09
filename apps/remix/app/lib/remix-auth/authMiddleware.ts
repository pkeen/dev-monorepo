// import { json } from "@remix-run/node";
import { getSession } from "~/lib/remix-auth/sessionStorage";
import { redirect } from "react-router";
import { authSystem } from "../../auth";
import {
	User,
	AuthValidationResult,
	AuthResult,
} from "@pete_keen/authentication-core";

interface AuthMiddlewareUser {
	user: User | null;
	isLoggedIn: boolean;
}

// import jwt from "jsonwebtoken";

// Middleware to fetch and validate the user
export async function authMiddleware(
	request: Request
): Promise<AuthMiddlewareUser> {
	// Get the keycards from the session
	const session = await getSession(request.headers.get("Cookie"));
	const keyCards = session.get("keyCards");

	// console.log("authMiddleware keyCards:", keyCards);

	const authResult = await authSystem.validate(keyCards);
	// console.log("authResult: ", authResult);

	if (authResult.success) {
		return { user: authResult.user, isLoggedIn: true };
	} else {
		// return redirect("/auth/login");
		return { user: null, isLoggedIn: false };
	}

	// return keyCards
	// 	? authSystem.validate(keyCards)
	// 	: { user: null, isAuthenticated: false };

	// const token = session.get("accessToken");

	// if (!token) {
	// 	return { user: null, isAuthenticated: false };
	// }

	// try {
	// 	const user = jwt.verify(token, process.env.JWT_SECRET); // Use your secret key
	// 	return { user, isAuthenticated: true };
	// } catch (err) {
	// 	throw json({ error: "Invalid token" }, { status: 401 });
	// }
}
