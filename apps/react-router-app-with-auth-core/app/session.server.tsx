import { createCookieSessionStorage, createCookie } from "react-router";
import type { AuthState } from "@pete_keen/authentication-core";

export interface SessionData {
	authState: AuthState;
}

// Create session storage
export const { getSession, commitSession, destroySession } =
	createCookieSessionStorage<SessionData>({
		cookie: {
			name: "auth_session", // Name of the cookie
			// secrets: ["your-secret-key"], // Replace with a secure key
			secure: process.env.NODE_ENV === "production", // Secure cookies in production
			httpOnly: true, // Prevent client-side access
			sameSite: "lax", // CSRF protection
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 1 week
		},
	});

export const stateCookie = createCookie("state", {
	maxAge: 60 * 10,
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
});

export const codeVerifierCookie = createCookie("codeVerifier", {
	maxAge: 60 * 10,
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
});
