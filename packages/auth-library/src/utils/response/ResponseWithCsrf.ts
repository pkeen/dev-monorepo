import { NextResponse } from "next/server";
import { getAuthConfig } from "config";

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
	cookieKey?: string, // Optional, fallback to config-based key
	cookieOptions: CookieOptions = {},
	init: ResponseInit = { status: 200 }
): NextResponse {
	// Get the centralized auth config
	const config = getAuthConfig();

	// Default cookie key and options from config
	const defaultCookieKey = `${config.cookies.namePrefix}-csrf-token`;
	const cookieOptionsWithDefaults: CookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 3600,
		sameSite: "lax",
		...cookieOptions, // Allow overrides
	};

	// Create the response
	const response = NextResponse.json(data, init);

	// Set the cookie with the CSRF token
	response.cookies.set(
		cookieKey || defaultCookieKey,
		csrf,
		cookieOptionsWithDefaults
	);

	return response;
}
