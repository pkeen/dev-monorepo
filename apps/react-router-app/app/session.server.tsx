import { createCookieSessionStorage, createCookie } from "react-router";

// export interface SessionData {
// 	keyCards: KeyCard[] | null;
// 	user: User | null;
// 	authenticated: boolean | undefined;
// 	csrf: string | null;
// }

// Create session storage
export const { getSession, commitSession, destroySession } =
	createCookieSessionStorage({
		cookie: {
			name: "__session", // Name of the cookie
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
