import { NextRequest, NextResponse } from "next/server";
import { AuthResponse } from "./lib/auth/utils";
import { verifyAndRefresh } from "@/lib/auth/utils/token/jwt";
import AuthConfig from "./lib/auth/config";

// for testing wo middle ware
export function middleware(request: NextRequest) {
	return NextResponse.next();
}

// export function middleware(request: NextRequest) {
// 	const token = request.cookies.get(
// 		`${AuthConfig.cookies.namePrefix}-token`
// 	)?.value;
// 	// Log middleware activity
// 	console.log("Middleware running on:", request.nextUrl.pathname);

// 	if (!token) {
// 		console.log("No token found, redirecting to /signin");
// 		return NextResponse.redirect(new URL("/signin", request.url));
// 	}

// 	return verifyAndRefresh(token)
// 		.then((newToken) => {
// 			console.log("newToken:", newToken);
// 			// If user already signed in, and trying to access /signin, redirect to /dashboard
// 			console.log("request.nextUrl.pathname:", request.nextUrl.pathname);
// 			if (request.nextUrl.pathname === "/signin") {
// 				console.log("signin route: redirecting to /dashboard");
// 				return NextResponse.redirect(
// 					new URL("/dashboard", request.url)
// 				);
// 			}
// 			const response = AuthResponse.next();
// 			response.setCookie(newToken);
// 			return response;
// 		})
// 		.catch((error) => {
// 			console.error("error:", error);
// 			return NextResponse.redirect(new URL("/auth/signin", request.url));
// 		}); // Redirect to login if token is invalid

// 	// return verifyToken(token)
// 	// 	.then((payload) => {
// 	// 		console.log("payload:", payload);
// 	// 		return NextResponse.next(); // allow the request to continue
// 	// 	})
// 	// 	.catch((error) => {
// 	// 		console.error("error:", error);
// 	// 		return NextResponse.redirect(new URL("/signin", request.url)); // Redirect to login if token is invalid
// 	// 	});
// }

// export const config = {
// 	matcher: ["/dashboard"], // Match specific routes
// 	/*
// 	 * Match all routes by default, except the following:
// 	 * - Public pages: `/signin`
// 	 * - API routes: `/api/public/:path*`
// 	 */
// 	// matcher: ["/((?!_next|static|api/auth|signup|public).*)"], // Protect all except these patterns
// };
