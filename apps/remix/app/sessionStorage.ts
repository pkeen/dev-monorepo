import { createCookieSessionStorage } from "@remix-run/node";

// Create session storage
export const sessionStorage = createCookieSessionStorage({
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

// Get session
export const getSession = (request: Request) =>
	sessionStorage.getSession(request.headers.get("Cookie"));
