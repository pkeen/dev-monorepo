import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
// import { authMiddleware } from "~/lib/remix-auth/authMiddleware";
import {
	csrfMiddleware,
	getCsrfTokenFromCookie,
	generateAndSetCsrfToken,
} from "~/lib/remix-auth/csrfMiddleware";
import { User } from "@pete_keen/authentication-core";
import { getSession, commitSession } from "~/lib/remix-auth/sessionStorage";
import { authSystem } from "~/auth";
import { authMiddleware } from "~/lib/remix-auth/authMiddleware";

// interface WithAuthArgs extends ActionFunctionArgs {
// 	user: User;
// }

// Auth and CSRF wrapper
export function withAuth(
	handler: Function,
	options: {
		csrf: boolean;
		role?: string;
	} = { csrf: true }
) {
	return async function ({
		request,
	}: ActionFunctionArgs | LoaderFunctionArgs) {
		// Apply CSRF middleware if enabled
		// if (options.csrf && authConfig.csrf) {
		// 	await csrfMiddleware(request);
		// }
		// leave the option for now - will only make sense when its a factory function
		console.log("withAuth - options: ", options);

		const csrfCheck = options.csrf;
		// add && authConfig.csrf

		// Validate auth
		const { user, isLoggedIn } = await authMiddleware(request);

		if (csrfCheck) {
			// will throw error if not valid csrf
			await csrfMiddleware(request);
		}

		// Role-based access check
		// if (role && (!user || !user.roles.includes(role))) {
		// 	throw new Response(JSON.stringify({ error: "Permission denied" }), {
		// 		status: 403,
		// 	});
		// }

		// // test id based access check
		// if (user.id !== "2d518ba8-3cb6-44af-8f3f-9ce79ba11b8c") {
		// 	throw new Response(JSON.stringify({ error: "Permission denied" }), {
		// 		status: 403,
		// 	});
		// }
		// Pass user to the handler
		return handler({ request, user, isLoggedIn });
	};
}

// Auth and CSRF wrapper
export function withRemixAuth(
	handler: Function,
	options: {
		csrf: boolean;
		role?: string;
	} = { csrf: true }
) {
	return async function ({
		request,
	}: ActionFunctionArgs | LoaderFunctionArgs) {
		// console.log("withRemixAuth - options: ", options);
		// Step 1: Get CSRF Token or create one if not present
		const csrf = await getCsrfTokenFromCookie(request);
		// console.log("withRemixAuth - csrf: ", csrf);
		if (!csrf) {
			console.log("withRemixAuth - setting csrf token");
			return await generateAndSetCsrfToken(request);
		}

		// Verify CSRF if wanted
		const csrfCheck = options.csrf;
		if (csrfCheck) {
			// will throw error if not valid csrf
			await csrfMiddleware(request);
		}

		// Validate auth
		const { user, isLoggedIn } = await authMiddleware(request);

		return handler({ request, user, isLoggedIn, csrf });

		// TO-DO - Role based access checks
	};
}

// Auth and CSRF wrapper
export function withValidation(
	handler: Function,
	options: {
		csrf: boolean;
		role?: string;
	} = { csrf: true }
) {
	return async function ({
		request,
	}: ActionFunctionArgs | LoaderFunctionArgs) {
		// Step 1 - load the session data
		const session = await getSession(request.headers.get("Cookie"));
		// Step 2: Get CSRF Token or create one if not present
		let csrf = session.get("csrf");
		// console.log("withRemixAuth - csrf: ", csrf);
		// Step 2a: Check if csrf is present
		if (!csrf) {
			console.log("withValidation - setting csrf token");
			csrf = await authSystem.generateCsrfToken();
			session.set("csrf", csrf);
		}

		// Verify CSRF if needed
		const csrfCheck = options.csrf;
		if (csrfCheck) {
			// will throw error if not valid csrf
			await csrfMiddleware(request, csrf);
		}

		// Validate auth
		const { user, isLoggedIn } = await authMiddleware(request);

		console.log("withValidation - user: ", user);
		console.log("withValidation - isLoggedIn: ", isLoggedIn);

		// set these as session variables
		session.set("user", user);
		session.set("isLoggedIn", isLoggedIn);
		// Step 6: Commit the session (with new CSRF token if generated)
		const headers: HeadersInit = {
			"Set-Cookie": await commitSession(session),
		};

		// Call the handler with user and CSRF data
		const data = await handler({ request, user, isLoggedIn, csrf });

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

export const getSessionData = async (request: Request) => {
	const session = await getSession(request.headers.get("Cookie"));
	const user = session.get("user");
	console.log("getSessionData - user: ", user);
	const isLoggedIn = session.get("isLoggedIn");
	return { user, isLoggedIn };
};
