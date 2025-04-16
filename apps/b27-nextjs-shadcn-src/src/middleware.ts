export { thia as middleware } from "./auth";

export const config = {
	matcher: [
		/*
		 * Match all paths except:
		 * - _next (static files and compiled assets)
		 * - favicon, robots.txt, and images
		 */
		"/((?!_next/static|_next/image|favicon.ico|robots.txt|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
	],
};
