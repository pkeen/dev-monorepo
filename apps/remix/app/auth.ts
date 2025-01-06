import {
	AuthSystem,
	JwtConfig,
	AuthConfig,
	// createAuthSystem,
} from "@pete_keen/authentication-core";
import {
	TestAdapter,
	DrizzleAdapter,
} from "@pete_keen/authentication-core/adapters";
import db from "./lib/db/db";
import { redirect, type ActionFunctionArgs } from "react-router";
import { sessionStorage, getSession } from "./lib/remix-auth/sessionStorage";

// App-specific config extension
export interface ExtendedAuthConfig {
	redirectAfterLogin?: string;
	redirectAfterLogout?: string;
}

// Combined configuration for dependency injection
export type AppAuthConfig = AuthConfig & ExtendedAuthConfig;

if (!process.env.JWT_ACCESS_SECRET) {
	// throw new Error("JWT_ACCESS_SECRET not found in process.env");
	console.log(
		"process.env.JWT_ACCESS_SECRET:",
		process.env.JWT_ACCESS_SECRET
	);
}

if (!process.env.JWT_REFRESH_SECRET) {
	// throw new Error("JWT_REFRESH_SECRET not found in process.env");
	console.log(
		"process.env.JWT_REFRESH_SECRET:",
		process.env.JWT_REFRESH_SECRET
	);
}

const jwtOptions: JwtConfig = {
	access: {
		key: "access",
		secretKey: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
		algorithm: "HS256",
		expiresIn: "30 minutes",
		fields: ["id", "email"],
	},
	refresh: {
		key: "refresh",
		secretKey: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
		algorithm: "HS256",
		expiresIn: "7 days",
		fields: ["id"],
	},
};

const databaseAdapter = DrizzleAdapter(db);

// export const authSystem = AuthSystem.create({
// 	strategy: "jwt",
// 	jwtConfig: jwtOptions,
// 	adapter: databaseAdapter,
// 	logger: {
// 		level: "debug",
// 	},
// });

export const remixAuth = (config: AppAuthConfig) => {
	const authSystem = AuthSystem.create(config);

	const createLoginAction = (authSystem: AuthSystem, redirectTo?: string) => {
		return async function login({ request }: ActionFunctionArgs) {
			const formData = await request.formData();
			// console.log("form data", formData);

			let session = await getSession(request);
			// console.log("session data:", session.data);

			const entries = Object.fromEntries(formData);
			const email = entries.email;
			const password = entries.password;
			if (typeof email !== "string" && typeof password !== "string") {
				console.error(
					"Expected email and password to be strings, but received non-string values."
				);
			}

			const authState = await authSystem.authenticate({
				email: email as string,
				password: password as string,
			});

			console.log("authState", authState);

			if (!authState.isLoggedIn) {
				return new Response(JSON.stringify(authState), {
					success: false,
					message: "Sign in failed",
				});
			}

			// Get or create a session
			session = await getSession(request);
			// console.log("session", session);

			// Store the keycards array in session
			session.set("keyCards", authState.keyCards); // Can be any JSON array

			// Commit session and set cookie header
			const cookie = await sessionStorage.commitSession(session);

			// console.log("authState", authState);
			// needs session storage

			// If redirectTo is provided, redirect and set cookie
			if (redirectTo) {
				return redirect(redirectTo, {
					headers: {
						"Set-Cookie": cookie, // Properly set headers
					},
				});
			}

			// Otherwise, return a response and still set the cookie
			return new Response(
				JSON.stringify(authState), // Response body
				{
					headers: {
						"Set-Cookie": cookie, // Properly set headers
					},
				}
			);
		};
	};
	const createLogoutAction = (
		authSystem: AuthSystem,
		redirectTo?: string
	) => {
		return async function logout({ request }: ActionFunctionArgs) {
			// Retrieve the session
			let session = await getSession(request);
			const keyCards = await session.get("keyCards");
			console.log("keyCards", keyCards);

			// Destroy the session and get a new cookie
			const cookie = await sessionStorage.destroySession(session);
			console.log("Session destroyed!");

			// call the auth system method
			const authState = await authSystem.logout(keyCards);

			// Handle redirect with Set-Cookie header
			if (redirectTo) {
				return redirect(redirectTo, {
					headers: {
						"Set-Cookie": cookie, // <- Send the cookie header
					},
				});
			}

			// Return JSON response with the Set-Cookie header
			return new Response(
				JSON.stringify({
					success: true,
					message: "Session destroyed!",
				}),
				{
					status: 200,
					headers: {
						"Set-Cookie": cookie, // <- Send the cookie header
						"Content-Type": "application/json",
					},
				}
			);
		};
	};
	const createSignupAction = (
		authSystem: AuthSystem,
		redirectTo?: string
	) => {
		return async function signup({ request }: ActionFunctionArgs) {
			// get the form data
			const formData = await request.formData();
			console.log("form data", formData);
			const entries = Object.fromEntries(formData);
			const email = entries.email;
			const password = entries.password;
			if (typeof email !== "string" && typeof password !== "string") {
				console.error(
					"Expected email and password to be strings, but received non-string values."
				);
			}

			// create the user
			const authState = await authSystem.signup({
				email: email as string,
				password: password as string,
			});

			if (!authState.isLoggedIn) {
				return new Response(JSON.stringify(authState), {
					success: false,
					message: "Sign up failed",
				});
			}
			// Get or create a session
			let session = await getSession(request);
			console.log("session", session);

			// Store the keycards array in session
			session.set("keyCards", authState.keyCards); // Can be any JSON array

			// Commit session and set cookie header
			const cookie = await sessionStorage.commitSession(session);

			console.log("authState", authState);
			// needs session storage

			// If redirectTo is provided, redirect and set cookie
			if (redirectTo) {
				return redirect(redirectTo, {
					headers: {
						"Set-Cookie": cookie, // Properly set headers
					},
				});
			}

			// Otherwise, return a response and still set the cookie
			return new Response(
				JSON.stringify(authState), // Response body
				{
					headers: {
						"Set-Cookie": cookie, // Properly set headers
					},
				}
			);
		};
	};
	return {
		authSystem,
		login: createLoginAction(authSystem, config.redirectAfterLogin),
		logout: createLogoutAction(authSystem, config.redirectAfterLogout),
		signup: createSignupAction(authSystem, config.redirectAfterLogin),
	};
};

export const { authSystem, login, logout, signup } = remixAuth({
	strategy: "jwt",
	jwtConfig: jwtOptions,
	adapter: databaseAdapter,
	logger: {
		level: "debug",
	},
	redirectAfterLogin: "/",
	redirectAfterLogout: "/",
});

// export const sessionStateStorage = new NextSessionStateStorage();
