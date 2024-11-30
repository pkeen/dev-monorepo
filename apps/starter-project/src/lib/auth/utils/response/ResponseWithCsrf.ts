import { NextResponse } from "next/server";
import { getAuthConfig } from "../../config";

interface CookieOptions {
	httpOnly?: boolean;
	secure?: boolean;
	path?: string;
	maxAge?: number;
	sameSite?: "strict" | "lax" | "none" | undefined;
}

export function ResponseWithCsrf(
	csrf: string,
	data: any,
	cookieKey?: string,
	cookieOptions: CookieOptions = {},
	init: ResponseInit = { status: 200 }
): NextResponse {
	const response = NextResponse.json(data, init);
	const cookieOptionsWithDefaults: CookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 3600,
		sameSite: "lax",
		...cookieOptions,
	};
	cookieKey = cookieKey || `${getAuthConfig().cookies.namePrefix}-csrf`;
	response.cookies.set(cookieKey, csrf, cookieOptionsWithDefaults);
	return response;
}
