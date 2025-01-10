// // TO-DO
// // Master Middleware
// import { authMiddleware } from "./authMiddleware";
// import { csrfTokenMiddleware, csrfMiddleware } from "./csrfMiddleware";

// export async function middleware(request: Request) {
// 	// TO-DO
// 	// Questions
// 	// - will this run everywhere

// 	// Step 1
// 	// Get CSRF Token or create one if not present
// 	const csrfResponse = await csrfTokenMiddleware(request);
// 	const { csrfToken } = await csrfResponse.json();
// 	// console.log("csrfToken: ", csrfToken);
// 	const setCookieHeader = csrfResponse.headers.get("Set-Cookie"); // save the cookie header to be added

// 	// Step 2
// 	// Validate CSRF Token - al csrfMiddleware
// 	// It is skipped for GET, HEAD, and OPTIONS
// 	await csrfMiddleware(request);
// 	// Step 3
// 	// Run Auth Middleware
// 	// Providing User and Authenticated
// 	const { user, isLoggedIn } = await authMiddleware(request);
// 	// console.log("middleware - user: ", user);
// 	// console.log("middleware - isLoggedIn: ", isLoggedIn);
// 	// Step 4
// 	return new Response(
// 		JSON.stringify({
// 			csrf: csrfToken,
// 			user,
// 			isLoggedIn,
// 		}),
// 		{
// 			headers: {
// 				"Set-Cookie": setCookieHeader,
// 			},
// 		}
// 	);
// }
