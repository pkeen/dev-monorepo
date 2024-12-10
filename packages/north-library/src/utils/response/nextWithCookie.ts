// import { NextResponse } from "next/server";
// import { getAuthConfig } from "config";

// interface CookieOptions {
// 	httpOnly?: boolean;
// 	secure?: boolean;
// 	path?: string;
// 	maxAge?: number;
// 	sameSite?: "strict" | "lax" | "none" | undefined;
// }

// export function nextWithCookie(
// 	token: string,
// 	cookieKey?: string | undefined,
// 	cookieOptions: CookieOptions = {}
// ): NextResponse {
// 	const config = getAuthConfig();
// 	const response = NextResponse.next();
// 	const cookieOptionsWithDefaults = {
// 		httpOnly: true,
// 		secure: process.env.NODE_ENV === "production",
// 		path: "/",
// 		maxAge: 3600,
// 		sameSite: "lax" as "lax",
// 		...cookieOptions,
// 	};

// 	cookieKey = cookieKey || `${config.cookies.namePrefix}-token`;

// 	response.cookies.set(cookieKey, token, cookieOptionsWithDefaults);
// 	return response;
// }
