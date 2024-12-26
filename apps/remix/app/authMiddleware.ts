// import { json } from "@remix-run/node";
import { getSession } from "~/sessionStorage";
import { authSystem } from "./auth";
import { User } from "@pete_keen/authentication-core";

interface AuthMiddlewareUser {
	user: User | null;
	isAuthenticated: boolean;
}

// import jwt from "jsonwebtoken";

// Middleware to fetch and validate the user
export async function authMiddleware(
	request: Request
): Promise<AuthMiddlewareUser> {
	const session = await getSession(request);
	const keyCards = await session.get("keyCards");

	console.log("authMiddleware keyCards:", keyCards);

	return keyCards
		? authSystem.validate(keyCards)
		: { user: null, isAuthenticated: false };

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
