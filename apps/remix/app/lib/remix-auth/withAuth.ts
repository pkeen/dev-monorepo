import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { authMiddleware } from "~/lib/remix-auth/authMiddleware";
import { csrfMiddleware } from "~/lib/remix-auth/csrfMiddleware";
import { User } from "@pete_keen/authentication-core";

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
