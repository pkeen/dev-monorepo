import {
	createCookie,
	redirect,
	createCookieSessionStorage,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
} from "react-router";
// import { stateCookie } from "./session.server";
import {
	AuthSystem,
	type AuthState,
	type AuthConfig,
	type UserProfile,
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

	const codeVerifierCookie = createCookie("codeVerifier", {
		maxAge: 60 * 10,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
	});

	const login = async ({
		request,
		params,
	}: {
		request: Request;
		params: any;
	}) => {
		const headers = new Headers(request.headers);
		const formData = await request.formData();

		const provider = formData.get("provider");
		console.log("PROVIDER in login from form:", provider);

		if (!provider) {
			redirect("/auth/login");
		}

		const authResult = await authSystem.login(provider?.toString());

		if (authResult.type === "redirect") {
			headers.append(
				"Set-Cookie",
				await stateCookie.serialize(authResult.state)
			);
			console.log("authResult.url:", authResult.url);
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

		return redirect(config.redirectAfterLogout || "/auth/logout", {
			headers,
		});
	};

	const requireAuth = async ({
		request,
		redirectTo,
	}: {
		request: Request;
		redirectTo?: string;
	}) => {
		const session = await getSession(request.headers.get("Cookie"));
		const sessionState = session.get("authState");
		console.log("sessionState: ", sessionState);
		if (!sessionState) {
			if (redirectTo) {
				throw redirect(redirectTo);
			}
			return null;
		}
		const authState = await authSystem.validate(sessionState.keyCards!);
		if (!authState.authenticated) {
			if (redirectTo) {
				throw redirect(redirectTo);
			}
			return null;
		}
		return authState.user;
	};

	const getUser = async ({
		request,
	}: {
		request: Request;
	}): Promise<UserProfile | null> => {
		// TODO: Check if user is authenticated
		const session = await getSession(request.headers.get("Cookie"));
		const sessionState = session.get("authState");
		console.log("sessionState: ", sessionState);
		if (!sessionState || !sessionState.authenticated) {
			return null;
		}
		const authState = await authSystem.validate(sessionState.keyCards);
		return authState.user;
	};

	const callback = async ({ request, params }: LoaderFunctionArgs) => {
		const { provider } = params;
		console.log("PROVIDER from redirect loader:", provider);

		// Retrieve the stored state from cookie
		const cookieHeader = request.headers.get("Cookie");
		const storedState = await stateCookie.parse(cookieHeader);
		console.log("STORED STATE:", storedState);
		const url = new URL(request.url);
		const code = url.searchParams.get("code");
		const returnedState = url.searchParams.get("state");
		console.log("RETURNED URL:", url);

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
				headers.append("Set-Cookie", await commitSession(session));
				return redirect(config.redirectAfterLogin || "/", {
					headers,
				});
			} else if (authResult.type === "redirect") {
				console.log("REDIRECT");
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
	}: LoaderFunctionArgs): { page: string; provider?: string } => {
		const { action } = params;
		if (action === "redirect") {
			if (params.provider) {
				console.log("PROVIDER:", params.provider);
				return callback({ request, params });
			}
		}

		console.log("ACTION:", action);
		// console.log("PROVIDER:", provider);
		// if (action === "redirect") {
		// 	return redirect({ request, params });
		// }
		if (action === "login") {
			return { page: "login" };
		}
	};

	return {
		login,
		logout,
		requireAuth,
		getUser,
		// redirect,
		authAction,
		authLoader,
	};
};

// const login = async ({ request }: { request: Request }) => {
// 	const headers = new Headers(request.headers);
// 	const formData = await request.formData();

// 	const provider = formData.get("provider");
// 	console.log("PROVIDER:", provider);

// 	if (!provider) {
// 		redirect("/auth/login");
// 	}

// 	const authResult = await authSystem.login(provider?.toString());

// 	if (authResult.type === "redirect") {
// 		headers.append(
// 			"Set-Cookie",
// 			await stateCookie.serialize(authResult.state)
// 		);
// 		console.log("authResult.url:", authResult.url);
// 		return redirect(authResult.url, { headers });
// 	}
// };
