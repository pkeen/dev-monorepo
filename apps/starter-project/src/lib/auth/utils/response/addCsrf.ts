import { NextResponse } from "next/server";
import config from "../../config";

/*
 * Sets a Csrf token as an HTTP-only cookie.
 * @param response - A response object.
 * @param token - The token to set.
 * @param key? - Optional. The name of the cookie.
 * @param options? - Optional Cookie options.
 */

interface CookieOptions {
	httpOnly?: boolean;
	secure?: boolean;
	path?: string;
	maxAge?: number;
	sameSite?: "strict" | "lax" | "none" | undefined;
}

export function addCsrf(
	response: NextResponse,
	csrf: string,
	cookieKey: string = `${config.cookies.namePrefix}-token`,
	cookieOptions: CookieOptions = {}
): NextResponse {
	// const response = NextResponse.json(data, init);
	// not needed as supplied as an argument
	const cookieOptionsWithDefaults: CookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 3600,
		sameSite: "lax",
		...cookieOptions,
	};

	response.cookies.set(cookieKey, csrf, cookieOptionsWithDefaults);
	return response;
}
