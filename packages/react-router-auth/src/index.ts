import {
	createCookie,
	redirect,
	createCookieSessionStorage,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	type ActionFunction,
	type LoaderFunction,
} from "react-router";
// import { stateCookie } from "./session.server";
import {
	AuthSystem,
	type AuthState,
	type AuthConfig,
	type User,
	type Providers,
	type DisplayProvider,
} from "@pete_keen/authentication-core";

// App-specific config extension
export interface ExtendedAuthConfig {
	redirectAfterLogin?: string;
	redirectAfterLogout?: string;
	sessionSecret: string;
	sessionName?: string;
	sessionMaxAge?: number;
}

export type RRAuthConfig = AuthConfig & ExtendedAuthConfig;

export interface SessionData {
	authState: AuthState;
}

export interface WithAuthHandlerArgs {
	request: Request;
	user: User | null;
	// authState: AuthState;
	// csrf?: string | null;
	// formData?: FormData;
}

export type WithAuth<T> = (
	handler: HandlerFunction<T>
) => Promise<Response | T>;

export type HandlerFunction<T> = (args: WithAuthHandlerArgs) => Promise<T>;

export const Auth = (config: RRAuthConfig) => {
	const authSystem = AuthSystem.create(config);

	const { getSession, commitSession, destroySession } =
		createCookieSessionStorage<SessionData>({
			cookie: {
				name: config.sessionName || "auth_session",
				httpOnly: true,
				maxAge: config.sessionMaxAge || 60 * 60 * 24 * 7, // 1 week
				path: "/",
				sameSite: "lax",
				secrets: [config.sessionSecret],
				secure: process.env.NODE_ENV === "production",
			},
		});
	const stateCookie = createCookie("state", {
		maxAge: 60 * 10,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});

	// Not used currently but in PKCE system
	const codeVerifierCookie = createCookie("codeVerifier", {
		maxAge: 60 * 10,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});

	const login = async ({
		request,
	}: // params,
	{
		request: Request;
		// params: any;
	}) => {
		// await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3 seconds
		const headers = new Headers(request.headers);
		// console.log("LOGIN HEADERS:", headers);
		const formData = await request.formData();

		const provider = formData.get("provider");
		// console.log("PROVIDER in login from form:", provider);

		if (!provider) {
			redirect("/auth/login");
		}

		const authResult = await authSystem.login(provider?.toString());

		if (authResult.type === "redirect") {
			// console.log("authResult:", authResult);
			headers.append(
				"Set-Cookie",
				await stateCookie.serialize(authResult.state)
			);
			// Explicitly set a Content-Type header so that the client interprets the response correctly.
			headers.set("Content-Type", "text/html");
			// console.log("authResult.url:", authResult.url);
			// console.log("HEADERS FOR REDIRECT:", headers);
			return redirect(authResult.url, { headers });
		}
	};

	const logout = async ({ request }: { request: Request }) => {
		const session = await getSession(request.headers.get("Cookie"));
		const previousAuthState = await session.get("authState");
		const headers = new Headers();

		// call the auth system method
		if (!previousAuthState) {
			return new Response(null, {
				status: 400,
			});
		}
		const authState = await authSystem.logout(previousAuthState.keyCards);

		session.set("authState", authState);
		headers.append("Set-Cookie", await commitSession(session));

		return redirect(config.redirectAfterLogout || "/", {
			headers,
		});
	};

	/**
	 * This function will check authentication and return the User and headers
	 * The headers are there to be appended to the response to update the cookies
	 * @param request
	 * @returns { user: User | null; headers?: Headers }
	 */
	const requireAuth = async (
		request: Request,
		{ redirectTo }: { redirectTo?: string }
	): Promise<{ user: User | null; headers?: Headers }> => {
		const session = await getSession(request.headers.get("Cookie"));
		console.log("session: ", session);
		const sessionState = session.get("authState");
		console.log("sessionState: ", sessionState);

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

	/**
	 * this function is a wrapper to check authorization
	 * TODO: add an options object argument used to set the redirect url, check vs roles, permissions etc
	 * I still feel theres going to be some problems with this, so far and may need adjusting
	 * @param handler
	 * @returns Response.json(<T>)
	 */
	const withAuth = <T>(
		handler: HandlerFunction<T>,
		options?: { redirectTo?: string }
	) => {
		return async (args: LoaderFunctionArgs | ActionFunctionArgs) => {
			const { request } = args;
			const { user, headers } = await requireAuth(request, {
				redirectTo: options?.redirectTo,
			});
			// Add user to the loader/action context if needed, e.g. by modifying args or attaching it to locals.
			const result = await handler({ ...args, user });
			// If the handler returns a response, merge the headers (ensuring updated cookies are sent)
			// if (result instanceof Response) {
			// 	for (let [key, value] of headers?.entries() || []) {
			// 		result.headers.append(key, value);
			// 	}
			// 	return result;
			// }
			return Response.json({ ...result, user }, { headers });
		};
	};

	/**
	 * This function will return user from session
	 * It does not check for current authentication simply reads user from session cookie
	 * Ofc this will only work for jwt strategy
	 * @param request
	 * @returns User | null
	 */
	const getUser = async ({
		request,
	}: {
		request: Request;
	}): Promise<User | null> => {
		// TODO: Check if user is authenticated
		const session = await getSession(request.headers.get("Cookie"));
		const sessionState = session.get("authState");
		// console.log("sessionState: ", sessionState);
		if (!sessionState || !sessionState.authenticated) {
			return null;
		}
		return sessionState.user;
	};

	const callback = async ({ request, params }: LoaderFunctionArgs) => {
		const { provider } = params;
		console.log("GETTING TO CALLBACK FUNCTION");
		console.log("PROVIDER from redirect loader:", provider);

		// Retrieve the stored state from cookie
		const cookieHeader = request.headers.get("Cookie");
		const storedState = await stateCookie.parse(cookieHeader);
		console.log("STORED STATE:", storedState);
		const url = new URL(request.url);
		const error = url.searchParams.get("error");
		if (error) {
			console.log("ERROR:", error);
			return {
				page: "error",
				error,
			};
		}
		const code = url.searchParams.get("code");
		const returnedState = url.searchParams.get("state");
		// console.log("RETURNED URL:", url);

		const session = await getSession(request.headers.get("Cookie"));
		const headers = new Headers();

		// validate state
		if (
			!code ||
			!returnedState ||
			!storedState ||
			returnedState !== storedState
		) {
			console.log("RETURNED STATE", returnedState);
			console.log("STORED STATE", storedState);
			// bad request
			return new Response(null, {
				status: 400,
			});
		}

		try {
			// Getting here
			console.log("GETTING HERE");

			const authResult = await authSystem.login(provider, code);
			// console.log("authResult:", authResult);

			if (authResult.type === "success") {
				console.log("SUCCESS");
				session.set("authState", authResult.authState);
				// Add the Content-Type header here too.
				headers.append("Content-Type", "text/html");
				headers.append("Set-Cookie", await commitSession(session));
				return redirect(config.redirectAfterLogin || "/", {
					headers,
				});
			} else if (authResult.type === "redirect") {
				console.log("REDIRECT");
				// Add the Content-Type header here too.
				headers.append("Content-Type", "text/html");
				return redirect(authResult.url);
			} else {
				throw new Error("Unknown authResult type");
			}
		} catch (e) {
			console.log("ERROR:", e);
		}
	};

	const authAction = async ({ request, params }: ActionFunctionArgs) => {
		const { action } = params;
		console.log("ACTION:", action);
		// console.log("PROVIDER:", provider);
		if (action === "login") {
			console.log("GETTING HERE");
			return await login({ request });
		}
		if (action === "logout") {
			return await logout({ request });
		}
		return null;
	};

	const authLoader = async ({
		request,
		params,
	}: LoaderFunctionArgs): Promise<
		| {
				page: string;
				providers?: DisplayProvider[];
		  }
		| Response
		| undefined
	> => {
		const { action } = params;
		console.log("ACTION:", action);
		if (action === "redirect") {
			if (params.provider) {
				console.log("PROVIDER:", params.provider);
				return callback({ request, params });
			}
		}
		if (action === "login") {
			return { page: "login", providers: authSystem.listProviders() };
		}
	};

	return {
		login,
		logout,
		requireAuth,
		withAuth,
		getUser,
		// redirect,
		authAction,
		authLoader,
	};
};

export default Auth;
