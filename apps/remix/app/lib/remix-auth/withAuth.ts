// import {
// 	ActionFunctionArgs,
// 	LoaderFunctionArgs,
// 	ActionFunction,
// 	LoaderFunction,
// } from "react-router";

// // import { authMiddleware } from "~/lib/remix-auth/authMiddleware";
// import { csrfMiddleware } from "~/lib/remix-auth/csrfMiddleware";
// import {
// 	getSession,
// 	commitSession,
// 	destroySession,
// } from "~/lib/remix-auth/sessionStorage";
// import { authSystem } from "~/auth";
// // import { authMiddleware } from "~/lib/remix-auth/authMiddleware";
// import { User, KeyCards, AuthState } from "@pete_keen/authentication-core";

// // interface WithAuthArgs extends ActionFunctionArgs {
// // 	user: User;
// // }

// // // Auth and CSRF wrapper
// // export function withAuth(
// // 	handler: Function,
// // 	options: {
// // 		csrf: boolean;
// // 		role?: string;
// // 	} = { csrf: true }
// // ) {
// // 	return async function ({
// // 		request,
// // 	}: ActionFunctionArgs | LoaderFunctionArgs) {
// // 		// Apply CSRF middleware if enabled
// // 		// if (options.csrf && authConfig.csrf) {
// // 		// 	await csrfMiddleware(request);
// // 		// }
// // 		// leave the option for now - will only make sense when its a factory function
// // 		console.log("withAuth - options: ", options);

// // 		const csrfCheck = options.csrf;
// // 		// add && authConfig.csrf

// // 		// Validate auth
// // 		const { user, isLoggedIn } = await authMiddleware(request);

// // 		if (csrfCheck) {
// // 			// will throw error if not valid csrf
// // 			await csrfMiddleware(request);
// // 		}

// // 		// Role-based access check
// // 		// if (role && (!user || !user.roles.includes(role))) {
// // 		// 	throw new Response(JSON.stringify({ error: "Permission denied" }), {
// // 		// 		status: 403,
// // 		// 	});
// // 		// }

// // 		// // test id based access check
// // 		// if (user.id !== "2d518ba8-3cb6-44af-8f3f-9ce79ba11b8c") {
// // 		// 	throw new Response(JSON.stringify({ error: "Permission denied" }), {
// // 		// 		status: 403,
// // 		// 	});
// // 		// }
// // 		// Pass user to the handler
// // 		return handler({ request, user, isLoggedIn });
// // 	};
// // }

// // // Auth and CSRF wrapper
// // export function withRemixAuth(
// // 	handler: Function,
// // 	options: {
// // 		csrf: boolean;
// // 		role?: string;
// // 	} = { csrf: true }
// // ) {
// // 	return async function ({
// // 		request,
// // 	}: ActionFunctionArgs | LoaderFunctionArgs) {
// // 		// console.log("withRemixAuth - options: ", options);
// // 		// Step 1: Get CSRF Token or create one if not present
// // 		const csrf = await getCsrfTokenFromCookie(request);
// // 		// console.log("withRemixAuth - csrf: ", csrf);
// // 		if (!csrf) {
// // 			console.log("withRemixAuth - setting csrf token");
// // 			return await generateAndSetCsrfToken(request);
// // 		}

// // 		// Verify CSRF if wanted
// // 		const csrfCheck = options.csrf;
// // 		if (csrfCheck) {
// // 			// will throw error if not valid csrf
// // 			await csrfMiddleware(request);
// // 		}

// // 		// Validate auth
// // 		const { user, isLoggedIn } = await authMiddleware(request);

// // 		return handler({ request, user, isLoggedIn, csrf });

// // 		// TO-DO - Role based access checks
// // 	};
// // }

// // interface AuthStatus {
// // 	user: User | null;
// // 	isLoggedIn: boolean;
// // 	keyCards: KeyCards | null;
// // }

// interface RemixAuthState {
// 	authState: AuthState;
// 	csrf: string | null;
// }

// // Auth and CSRF wrapper
// export function withValidation<T>(
// 	handler: HandlerFunction<T>,
// 	options: WithValidationOptions = { csrf: true }
// ): LoaderFunction | ActionFunction {
// 	return async function ({
// 		request,
// 	}: ActionFunctionArgs | LoaderFunctionArgs) {
// 		// Step 1 - load the session data
// 		const session = await getSession(request.headers.get("Cookie"));
// 		const headers = new Headers();
// 		const remixAuthState: RemixAuthState = {
// 			authState: {
// 				user: null,
// 				authenticated: false,
// 				keyCards: null,
// 			},
// 			csrf: null,
// 		};

// 		// Step 2: CSFR Protection -
// 		// Step 2a: Get CSRF Token or create one if not present
// 		let csrf = session.get("csrf");

// 		// Step 2b: Check if csrf is present
// 		if (!csrf) {
// 			csrf = await authSystem.generateCsrfToken();
// 			session.set("csrf", csrf);
// 			headers.append("Set-Cookie", await commitSession(session));
// 		}

// 		// Read the body once
// 		let formData = undefined;
// 		if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
// 			formData = await request.formData();
// 		}

// 		// Step 2c: Verify CSRF Token - if wanted csrfMiddleware
// 		const csrfCheck = options.csrf;
// 		if (csrfCheck) {
// 			// will throw error if not valid csrf
// 			await csrfMiddleware(request, csrf, formData);
// 		}

// 		// Step 3: Validate the keyCards
// 		const keyCards = session.get("keyCards");
// 		if (!keyCards) {
// 			// return Response.json(authStatus, { headers });
// 			return new Response(JSON.stringify(remixAuthState), {
// 				headers,
// 			});
// 		}

// 		// Step 4: Get the auth status and set the status and return object accordingly
// 		const authState = await authSystem.validate(keyCards);
// 		remixAuthState.authState = authState;
// 		remixAuthState.csrf = csrf;
// 		session.set("keyCards", authState.keyCards);
// 		session.set("user", authState.user);
// 		session.set("authenticated", authState.authenticated);
// 		headers.append("Set-Cookie", await commitSession(session));

// 		// Call the handler with user and CSRF data

// 		const data = await handler({ request, authState, csrf, formData });

// 		// console.log("withValidation - data: ", data);
// 		const withValidationData: WithValidationData<T> = {
// 			authState,
// 			csrf,
// 			data,
// 		};

// 		// TO-DO - Role based access checks
// 		// return data;
// 		// Make sure cookie is actually set must return headers
// 		return new Response(JSON.stringify(withValidationData), {
// 			headers,
// 		});
// 	};
// }

// export const getSessionData = async (request: Request) => {
// 	const session = await getSession(request.headers.get("Cookie"));
// 	const user = session.get("user");
// 	console.log("getSessionData - user: ", user);
// 	const authenticated = session.get("authenticated");
// 	return { user, authenticated };
// };

// // types/withValidation.d.ts
// export interface WithValidationHandlerArgs {
// 	request: Request;
// 	authState: AuthState;
// 	csrf: string | null;
// 	formData?: FormData;
// }

// export interface WithValidationData<T> {
// 	csrf: string | null;
// 	authState: AuthState;
// 	data: T;
// }

// export type HandlerFunction<T> = (
// 	args: WithValidationHandlerArgs
// ) => Promise<T>;

// export type WithValidation<T> = (
// 	handler: HandlerFunction<T>,
// 	options?: WithValidationOptions
// ) => LoaderFunction | ActionFunction;

// export interface WithValidationOptions {
// 	csrf?: boolean;
// 	role?: string;
// }

// export const withCsrf = (handler: Function) => {
// 	return async function (args: ActionFunctionArgs | LoaderFunctionArgs) {
// 		const session = await getSession(args.request.headers.get("Cookie"));
// 		const csrf = session.get("csrf");

// 		// Read the body once
// 		let formData = null;
// 		if (!["GET", "HEAD", "OPTIONS"].includes(args.request.method)) {
// 			formData = await args.request.formData();
// 		}
// 		console.log("with csrf - form data", formData);
// 		// test it by setting it different
// 		if (csrf && formData) {
// 			await csrfMiddleware(args.request, csrf, formData);
// 		}

// 		return handler({ ...args, formData });
// 	};
// };
