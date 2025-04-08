import {
	redirect,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from "react-router";
import { getSession, commitSession } from "../session.server";
import authSystem, { type CurrentUser } from "../auth";
// import { authz } from "../auth";
import type {
	UserPublic as User,
	IAuthManager,
} from "@pete_keen/authentication-core";

// /**
//  * This function will check authentication and return the User and headers
//  * The headers are there to be appended to the response to update the cookies
//  * @param request
//  * @returns { user: CurrentUser | null; headers?: Headers }
//  */
// export const requireAuth = async (
// 	request: Request,
// 	{ redirectTo }: { redirectTo?: string }
// ): Promise<{ user: EnrichedUser | null; headers?: Headers }> => {
// 	const session = await getSession(request.headers.get("Cookie"));
// 	console.log("Session Cookie", session);
// 	const sessionState = session.get("authState");
// 	console.log("sessionState: ", sessionState);

// 	if (!sessionState) {
// 		if (redirectTo) {
// 			throw redirect(redirectTo ?? "/auth/login");
// 		}
// 		return { user: null };
// 	}

// 	const authResult = await authSystem.validate(sessionState.keyCards!);
// 	console.log("AUTH RESULT (IN REQUIRE AUTH): ", authResult);
// 	// console.log("KEYCARDS IN AUTH RESPONSE: ", authResult.authState.keyCards); // this was causing an error when keycards not present
// 	if (authResult.type === "error" || authResult.type === "redirect") {
// 		console.log("SHOULD BE REDIRECTED");
// 		if (redirectTo) {
// 			throw redirect(redirectTo);
// 		}
// 		return { user: null };
// 	} else if (authResult.type === "refresh") {
// 		const headers = new Headers();
// 		console.log("GETTING TO REFRESH PART ON FRONT END");
// 		session.set("authState", authResult.authState);
// 		headers.append("Set-Cookie", await commitSession(session));
// 		// Return both the updated user and headers so the caller can forward them
// 		return { user: authResult.authState.user, headers };
// 	}

// 	return { user: authResult.authState.user };
// };

export const requireAuth = async <Extra>(
	request: Request,
	authSystem: IAuthManager<Extra>,
	{ redirectTo }: { redirectTo?: string }
): Promise<{ user: (User & Extra) | null; headers?: Headers }> => {
	const session = await getSession(request.headers.get("Cookie"));
	const sessionState = session.get("authState");

	if (!sessionState) {
		if (redirectTo) {
			throw redirect(redirectTo ?? "/auth/login");
		}
		return { user: null };
	}

	const authResult = await authSystem.validate(sessionState.keyCards!);

	if (authResult.type === "error" || authResult.type === "redirect") {
		if (redirectTo) {
			throw redirect(redirectTo);
		}
		return { user: null };
	} else if (authResult.type === "refresh") {
		const headers = new Headers();
		session.set("authState", authResult.authState);
		headers.append("Set-Cookie", await commitSession(session));
		return { user: authResult.authState.user, headers };
	}

	return { user: authResult.authState.user };
};

type HandlerFunction<T, U> = (
	args: (LoaderFunctionArgs | ActionFunctionArgs) & { user: U }
) => Promise<T>;

export const withAuth = <T, Extra>(
	authSystem: IAuthManager<Extra>,
	handler: HandlerFunction<T, User & Extra>,
	options: { redirectTo?: string } = { redirectTo: "/" }
) => {
	return async (args: LoaderFunctionArgs | ActionFunctionArgs) => {
		const { request } = args;

		const { user, headers } = await requireAuth<Extra>(
			request,
			authSystem,
			{
				redirectTo: options.redirectTo,
			}
		);

		if (!user) {
			if (options.redirectTo) {
				throw redirect(options.redirectTo);
			}
			return Response.json({ user }, { headers });
		}

		const result = await handler({ ...args, user });

		if (result instanceof Response) {
			for (let [key, value] of headers?.entries() || []) {
				result.headers.append(key, value);
			}
			return result;
		}

		return Response.json({ ...result, user }, { headers });
	};
};

// const withAuth = <T>(
// 	handler: HandlerFunction<T>,
// 	authSystem: IAuthManager<Extra>,
// 	options: { redirectTo?: string } = {
// 		redirectTo: "/",
// 		// role: null,
// 	}
// ) => {
// 	return async (args: LoaderFunctionArgs | ActionFunctionArgs) => {
// 		const { request } = args;
// 		const { user, headers } = await requireAuth(request, {
// 			redirectTo: options.redirectTo,
// 			// role: options.role,
// 		});
// 		// Add user to the loader/action context if needed, e.g. by modifying args or attaching it to locals.
// 		const result = await handler({ ...args, user });
// 		// If the handler returns a response, merge the headers (ensuring updated cookies are sent)
// 		// if (result instanceof Response) {
// 		// 	for (let [key, value] of headers?.entries() || []) {
// 		// 		result.headers.append(key, value);
// 		// 	}
// 		// 	return result;
// 		// }
// 		return Response.json({ ...result, user }, { headers });
// 	};
// };

// export const minRole = (role: string) => {
//     return async (request: Request) => {
//         const { user } = await requireAuth(request);
//         authz.checkRole(user, role);
//     };
// };

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
