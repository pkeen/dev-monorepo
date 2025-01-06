// import { json } from "@remix-run/node";
// import { generateCsrfToken, validateCsrfToken } from "auth-core/csrfUtils";
// import { getSession } from "~/sessionStorage";
import { authSystem } from "../../auth";
import { csrfCookie } from "~/lib/remix-auth/sessionStorage";
import { LoaderFunctionArgs } from "react-router";

// Generate or refresh CSRF token
export async function csrfTokenMiddleware(request: Request) {
	// get cookie
	const cookieHeader = request.headers.get("Cookie");
	const csrfCookieHeader = await csrfCookie.parse(cookieHeader);
	console.log("csrfCookieHeader: ", csrfCookieHeader);

	let csrfToken = csrfCookieHeader || (await authSystem.generateCsrfToken());

	console.log("csrfToken (middleware): ", csrfToken);

	return new Response(JSON.stringify({ csrfToken }), {
		headers: {
			"Set-Cookie": await csrfCookie.serialize(csrfToken),
			"Content-Type": "application/json",
		},
	});
}

export async function fetchCsrfToken(request: Request) {
	// return the csrf token or null
	const cookieHeader = request.headers.get("Cookie");
	const csrfCookieHeader = await csrfCookie.parse(cookieHeader);
	console.log("csrfCookieHeader: ", csrfCookieHeader);
	return csrfCookieHeader || null;
}

// Middleware function
// Validate CSRF token
export async function csrfMiddleware(request: Request) {
	//   if (!authConfig.csrf) return; // Skip validation if disabled - this wont work for now

	const safeMethods = ["GET", "HEAD", "OPTIONS"];
	if (safeMethods.includes(request.method)) return; // Skip safe methods

	const csrfCookieHeader = await csrfCookie.parse(
		request.headers.get("Cookie")
	);
	console.log("csrfCookieHeader: ", csrfCookieHeader);
	const csrfToken =
		request.headers.get("X-CSRF-Token") ||
		(await request.formData()).get("csrfToken");

	console.log("csrfToken: in middleware", csrfToken);

	if (!csrfToken || csrfToken !== csrfCookieHeader) {
		throw new Response(JSON.stringify({ error: "Invalid CSRF token" }), {
			status: 403,
			headers: { "Content-Type": "application/json" },
		});
	}
}

// // Generate token for forms
// export async function createCsrfToken(session) {
// 	const token = generateCsrfToken();
// 	session.set("csrfToken", token);
// 	return token;
// }
