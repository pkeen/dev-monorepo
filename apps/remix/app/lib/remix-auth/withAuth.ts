import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	ActionFunction,
	LoaderFunction,
} from "react-router";

// import { authMiddleware } from "~/lib/remix-auth/authMiddleware";
import { csrfMiddleware } from "~/lib/remix-auth/csrfMiddleware";
import {
	getSession,
	commitSession,
	destroySession,
} from "~/lib/remix-auth/sessionStorage";
import { authSystem } from "~/auth";
// import { authMiddleware } from "~/lib/remix-auth/authMiddleware";
import { User, KeyCards } from "@pete_keen/authentication-core";

// interface WithAuthArgs extends ActionFunctionArgs {
// 	user: User;
// }

// // Auth and CSRF wrapper
// export function withAuth(
// 	handler: Function,
// 	options: {
// 		csrf: boolean;
// 		role?: string;
// 	} = { csrf: true }
// ) {
// 	return async function ({
// 		request,
// 	}: ActionFunctionArgs | LoaderFunctionArgs) {
// 		// Apply CSRF middleware if enabled
// 		// if (options.csrf && authConfig.csrf) {
// 		// 	await csrfMiddleware(request);
// 		// }
// 		// leave the option for now - will only make sense when its a factory function
// 		console.log("withAuth - options: ", options);

// 		const csrfCheck = options.csrf;
// 		// add && authConfig.csrf

// 		// Validate auth
// 		const { user, isLoggedIn } = await authMiddleware(request);

// 		if (csrfCheck) {
// 			// will throw error if not valid csrf
// 			await csrfMiddleware(request);
// 		}

// 		// Role-based access check
// 		// if (role && (!user || !user.roles.includes(role))) {
// 		// 	throw new Response(JSON.stringify({ error: "Permission denied" }), {
// 		// 		status: 403,
// 		// 	});
// 		// }

// 		// // test id based access check
// 		// if (user.id !== "2d518ba8-3cb6-44af-8f3f-9ce79ba11b8c") {
// 		// 	throw new Response(JSON.stringify({ error: "Permission denied" }), {
// 		// 		status: 403,
// 		// 	});
// 		// }
// 		// Pass user to the handler
// 		return handler({ request, user, isLoggedIn });
// 	};
// }

// // Auth and CSRF wrapper
// export function withRemixAuth(
// 	handler: Function,
// 	options: {
// 		csrf: boolean;
// 		role?: string;
// 	} = { csrf: true }
// ) {
// 	return async function ({
// 		request,
// 	}: ActionFunctionArgs | LoaderFunctionArgs) {
// 		// console.log("withRemixAuth - options: ", options);
// 		// Step 1: Get CSRF Token or create one if not present
// 		const csrf = await getCsrfTokenFromCookie(request);
// 		// console.log("withRemixAuth - csrf: ", csrf);
// 		if (!csrf) {
// 			console.log("withRemixAuth - setting csrf token");
// 			return await generateAndSetCsrfToken(request);
// 		}

// 		// Verify CSRF if wanted
// 		const csrfCheck = options.csrf;
// 		if (csrfCheck) {
// 			// will throw error if not valid csrf
// 			await csrfMiddleware(request);
// 		}

// 		// Validate auth
// 		const { user, isLoggedIn } = await authMiddleware(request);

// 		return handler({ request, user, isLoggedIn, csrf });

// 		// TO-DO - Role based access checks
// 	};
// }

interface AuthStatus {
	user: User | null;
	isLoggedIn: boolean;
	keyCards: KeyCards | null;
}

// Auth and CSRF wrapper
export function withValidation<T>(
	handler: HandlerFunction<T>,
	options: WithValidationOptions = { csrf: true }
): LoaderFunction | ActionFunction {
	return async function ({
		request,
	}: ActionFunctionArgs | LoaderFunctionArgs) {
		// Step 1 - load the session data
		const session = await getSession(request.headers.get("Cookie"));
		console.log("withValidation - session: ", session.data);
		const headers = new Headers();
		// Default Auth Status - signed out
		const authStatus: AuthStatus = {
			user: null,
			isLoggedIn: false,
			keyCards: null,
		};
		// Step 2: CSFR Protection -
		// Step 2a: Get CSRF Token or create one if not present
		let csrf = session.get("csrf");
		// console.log("withRemixAuth - csrf: ", csrf);
		// Step 2b: Check if csrf is present
		if (!csrf) {
			console.log("withValidation - setting csrf token");
			csrf = await authSystem.generateCsrfToken();
			session.set("csrf", csrf);
			headers.append("Set-Cookie", await commitSession(session));
		}

		// Step 2c: Verify CSRF Token - if wanted csrfMiddleware
		const csrfCheck = options.csrf;
		if (csrfCheck) {
			// will throw error if not valid csrf
			await csrfMiddleware(request, csrf);
		}

		// Step 3: Validate the keyCards
		const keyCards = session.get("keyCards");
		if (!keyCards) {
			return Response.json(
				{ user: null, isLoggedIn: false, keyCards: null },
				{ headers }
			);
		}

		const authResult = await authSystem.validate(keyCards);
		// Add a headers object to be used later

		if (authResult.success === false) {
			// headers.append("Set-Cookie", await destroySession(session));
			authStatus.user = null;
			authStatus.isLoggedIn = false;
			authStatus.keyCards = null;
			// redirect to login?
		} else {
			session.set("user", authResult.user);
			session.set("isLoggedIn", true);
			session.set("keyCards", keyCards);
			authStatus.user = authResult.user;
			authStatus.isLoggedIn = true;
			authStatus.keyCards = keyCards;
			headers.append("Set-Cookie", await commitSession(session));
		}

		// Call the handler with user and CSRF data

		const data = await handler({ request, authStatus, csrf });

		console.log("withValidation - data: ", data);

		// TO-DO - Role based access checks
		// return data;
		// Make sure cookie is actually set must return headers
		return new Response(JSON.stringify(data), { headers });
	};
}

export function withSession(handler: Function) {
	return async function ({
		request,
	}: ActionFunctionArgs | LoaderFunctionArgs) {
		const session = await getSession(request.headers.get("Cookie"));
		const user = session.get("user");
		const isLoggedIn = session.get("isLoggedIn");
		return handler({ request, user, isLoggedIn });
	};
}

// To-Do withCsrf
// for login and signup

export const getSessionData = async (request: Request) => {
	const session = await getSession(request.headers.get("Cookie"));
	const user = session.get("user");
	console.log("getSessionData - user: ", user);
	const isLoggedIn = session.get("isLoggedIn");
	return { user, isLoggedIn };
};

// types/withValidation.d.ts
export interface WithValidationArgs {
	request: Request;
	authStatus: AuthStatus;
	csrf: string | null;
}

export type HandlerFunction<T> = (args: WithValidationArgs) => Promise<T>;

export interface WithValidationOptions {
	csrf?: boolean;
	role?: string;
}

export const withCsrf = (handler: Function) => {
	return async function (args: ActionFunctionArgs | LoaderFunctionArgs) {
		const session = await getSession(args.request.headers.get("Cookie"));
		const csrf = session.get("csrf");
		// test it by setting it different
		csrf && (await csrfMiddleware(args.request, csrf));
		return handler(args);
	};
};
