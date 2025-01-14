import { createCookieSessionStorage, createCookie } from "react-router";
// Create session storage
export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
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
// // Get session
// export const getSession = (request: Request) =>
// 	sessionStorage.getSession(request.headers.get("Cookie"));
// export const getCsrfSession = (request: Request) =>
// 	csrfStorage.getSession(request.headers.get("Cookie"));
// export const sessionStorage = createCookie("__session", {
// 	secure: process.env.NODE_ENV === "production",
// 	httpOnly: true,
// 	sameSite: "lax",
// 	maxAge: 60 * 60 * 24 * 7, // 1 week
// });
export const csrfCookie = createCookie("__csrf", {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict", // Stronger CSRF protection
    maxAge: 60 * 60 * 24 * 7, // 1 week
});
