// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getSession, commitSession } from "@/session";
import { thia } from "@/auth";

export const middleware = thia;

// export async function middleware(req: NextRequest) {
// 	console.log("MIDDLEWARE RUNNING");
// 	const session = await getSession();
// 	console.log("SESSION:", session);
// 	const sessionState = session?.data.authState;
// 	console.log("SESSION STATE:", sessionState);

// 	if (!sessionState) {
// 		// Redirect unauthenticated users
// 		return NextResponse.redirect(new URL("/auth/login", req.url));
// 	}

// 	const result = await authManager.validate(sessionState.keyCards!);

// 	// Handle errors and redirects
// 	if (result.type === "error" || result.type === "redirect") {
// 		return NextResponse.redirect(new URL("/auth/login", req.url));
// 	}

// 	// If the token was refreshed, update the cookie
// 	if (result.type === "refresh") {
// 		const updatedCookie = commitSession({
// 			authState: result.authState,
// 		});

// 		const res = NextResponse.next();
// 		res.cookies.set("session", updatedCookie);
// 		return res;
// 	}

// 	// Everything is fine, just continue
// 	return NextResponse.next();
// }

export const config = {
	matcher: ["/dashboard/:path*", "/api/protected/:path*"], // Protected routes
};
