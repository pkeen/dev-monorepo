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
import db from "./lib/db";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { sessionStorage, getSession } from "./sessionStorage";

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
		key: "KeyCard-access",
		secretKey: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
		algorithm: "HS256",
		expiresIn: "30 minutes",
		fields: ["id", "email"],
	},
	refresh: {
		key: "KeyCard-refresh",
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
		return async function login({ request }: { request: Request }) {
			const formData = await request.formData();
			console.log("form data", formData);

			let session = await getSession(request);
			console.log("session data:", session.data);
			// Needs redirection
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

			if (!authState.isLoggedIn) {
				return json({ success: false, message: "Sign in failed" });
			}

			// Get or create a session
			session = await getSession(request);
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
			return json(
				{ success: true, message: "Session created!" }, // Response body
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
	};
};

export const { authSystem, login } = remixAuth({
	strategy: "jwt",
	jwtConfig: jwtOptions,
	adapter: databaseAdapter,
	logger: {
		level: "debug",
	},
	redirectAfterLogin: "/",
});

// export const sessionStateStorage = new NextSessionStateStorage();
