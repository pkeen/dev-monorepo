// import { json } from "@remix-run/node";
import {
	getSession,
	commitSession,
	destroySession,
} from "~/lib/remix-auth/sessionStorage";
import { authSystem } from "../../auth";
import {
	User,
	AuthValidationResult,
	AuthResult,
	KeyCards,
} from "@pete_keen/authentication-core";
import { Session } from "react-router";

// interface AuthMiddlewareUser {
// 	user: User | null;
// 	isLoggedIn: boolean;
// }

// a simplified auth status to be returned to the client and stored
interface AuthStatus {
	user: User | null;
	isLoggedIn: boolean;
	keyCards: KeyCards | null;
}

// interface AuthMiddlewareResult {
// 	authStatus: AuthStatus;
// 	headers: HeadersInit;
// }

// Middleware to validate the keycard - and return AuthStatus
// export async function authMiddleware(
// 	request: Request
// ): Promise<AuthMiddlewareResult> {
// 	// Get the keycards from the session
// 	const session = await getSession(request.headers.get("Cookie"));
// 	const keyCards = session.get("keyCards");

// 	if (!keyCards) {
// 		return { user: null, isLoggedIn: false, keyCards: null };
// 	}
// 	const authResult = await authSystem.validate(keyCards);
// 	console.log("authResult: ", authResult);

// 	if (authResult.success) {
// 		return {
// 			user: authResult.user,
// 			isLoggedIn: true,
// 			keyCards: authResult.keyCards,
// 		};
// 	} else {
// 		return { user: null, isLoggedIn: false, keyCards: null };
// 	}
// }
// Middleware to validate the keycard - and return AuthStatus
export async function authStatusMiddleware(
	session: Session
): Promise<AuthStatus> {
	// Get the keycards from the session
	const keyCards = session.get("keyCards");

	if (!keyCards) {
		return { user: null, isLoggedIn: false, keyCards: null };
	}
	const authResult = await authSystem.validate(keyCards);

	if (authResult.success) {
		return {
			user: authResult.user,
			isLoggedIn: true,
			keyCards: authResult.keyCards,
		};
	} else {
		return { user: null, isLoggedIn: false, keyCards: null };
	}
}
