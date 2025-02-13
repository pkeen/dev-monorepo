import { redirect } from "react-router";
import { getSession, commitSession } from "../session.server";
import authSystem from "../auth";
import type { User } from "@pete_keen/authentication-core";

/**
 * This function will check authentication and return the User and headers
 * The headers are there to be appended to the response to update the cookies
 * @param request
 * @returns { user: User | null; headers?: Headers }
 */
export const requireAuth = async (
	request: Request,
	{ redirectTo }: { redirectTo?: string }
): Promise<{ user: User | null; headers?: Headers }> => {
	const session = await getSession(request.headers.get("Cookie"));
	const sessionState = session.get("authState");
	// console.log("sessionState: ", sessionState);

	if (!sessionState) {
		if (redirectTo) {
			throw redirect(redirectTo ?? "/auth/login");
		}
		return { user: null };
	}

	const authResult = await authSystem.validate(sessionState.keyCards!);
	// console.log("AUTH RESULT (IN REQUIRE AUTH): ", authResult);
	if (authResult.type === "error" || authResult.type === "redirect") {
		if (redirectTo) {
			throw redirect(redirectTo);
		}
		return { user: null };
	} else if (authResult.type === "refresh") {
		const headers = new Headers();
		session.set("authState", authResult.authState);
		headers.append("Set-Cookie", await commitSession(session));
		// Return both the updated user and headers so the caller can forward them
		return { user: authResult.authState.user, headers };
	}

	return { user: authResult.authState.user };
};

// export const useAuth = async ({
// 	request,
// }: LoaderFunctionArgs): Promise<UserProfile | null> => {
// 	// TODO: Check if user is authenticated
// 	const session = await getSession(request.headers.get("Cookie"));
// 	const sessionState = session.get("authState");
// 	console.log("sessionState: ", sessionState);
// 	if (!sessionState || !sessionState.authenticated) {
// 		return null;
// 	}
// 	const authState = await authSystem.validate(sessionState.keyCards);
// 	return authState.user;
// };

// export const requireAuth = async (
// 	request: Request,
// 	redirectTo?: string
// ): Promise<UserProfile | null> => {
// 	const session = await getSession(request.headers.get("Cookie"));
// 	const sessionState = session.get("authState");
// 	console.log("sessionState: ", sessionState);
// 	if (!sessionState) {
// 		if (redirectTo) {
// 			throw redirect(redirectTo);
// 		}
// 		return null;
// 	}
// 	const authState = await authSystem.validate(sessionState.keyCards!);
// 	if (!authState.authenticated) {
// 		if (redirectTo) {
// 			throw redirect(redirectTo);
// 		}
// 		return null;
// 	}
// 	return authState.user;
// };
