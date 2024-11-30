import { NextResponse } from "next/server";
import { getAuthConfig } from "../../config";

interface CookieOptions {
	httpOnly?: boolean;
	secure?: boolean;
	path?: string;
	maxAge?: number;
	sameSite?: "strict" | "lax" | "none" | undefined;
}

export class AuthResponse extends NextResponse {
	/**
	 * Sets a token as an HTTP-only cookie.
	 * @param token - The token to set.
	 * @param key? - Optional. The name of the cookie.
	 * @param options? - Optional Cookie options.
	 */
	setCookie(token: string, key?: string, options: CookieOptions = {}): void {
		const cookieOptions: CookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 3600,
			sameSite: "lax",
			...options,
		};
		key = key || `${getAuthConfig().cookies.namePrefix}-token`;

		this.cookies.set(key, token, cookieOptions);
	}

	setRefresh(token: string) {
		// this.setCookie(token, `${getAuthConfig().cookies.namePrefix}-refresh`);
		this.setCookie(token, "pk-auth-refresh");
	}

	setAccess(token: string) {
		// this.setCookie(token, `${getAuthConfig().cookies.namePrefix}-access`);
		this.setCookie(token, "pk-auth-access");
	}

	destroyCookie(key: string): void {
		console.log("Destroying cookie with key = ", key);
		this.cookies.set(key, "", { maxAge: 0 });
	}

	destroyRefresh(key?: string): void {
		key = key || `${getAuthConfig().cookies.namePrefix}-refresh`;
		this.destroyCookie(key);
	}

	destroyAccess(key?: string): void {
		key = key || `${getAuthConfig().cookies.namePrefix}-access`;
		this.destroyCookie(key);
	}

	/**
	 * Sets a csrf token as an HTTP-only cookie.
	 * @param csrf - The token to set.
	 * @param key? - Optional. The name of the cookie.
	 * @param options? - Optional Cookie options.
	 */
	setCsrf(csrf: string, key?: string, options: CookieOptions = {}): void {
		const cookieOptions: CookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 3600,
			sameSite: "lax",
			...options,
		};
		key = key || `${getAuthConfig().cookies.namePrefix}-csrf`;
		console.log(
			"Setting CSRF token name = ",
			getAuthConfig().cookies.namePrefix
		);
		this.cookies.set(key, csrf, cookieOptions);
	}

	destroyCsrf(key?: string): void {
		key = key || `${getAuthConfig().cookies.namePrefix}-csrf`;
		console.log("Destroying csrf with key = ", key);
		this.cookies.set(key, "", { maxAge: 0 });
	}

	/**
	 * Creates a new ExtendedResponse with JSON data and sets a cookie.
	 * @param options - The options for creating the response.
	 * @returns An AuthResponse instance.
	 */
	static withCookie({
		cookie,
		json,
		cookieKey,
		status = 200,
		cookieOptions,
	}: {
		cookie: string;
		json?: Record<string, any>;
		cookieKey?: string;
		status?: number;
		cookieOptions?: {
			httpOnly?: boolean;
			secure?: boolean;
			path?: string;
			maxAge?: number;
		};
	}): AuthResponse {
		const response = new AuthResponse(JSON.stringify(json), { status });
		response.setCookie(cookie, cookieKey, cookieOptions);
		return response;
	}
	/**
	 * Creates an instance of NextResponse.next() as AuthResponse.
	 * @returns An AuthResponse instance.
	 */
	static next(): AuthResponse {
		const response = NextResponse.next(); // Get the original `NextResponse.next()`
		return Object.assign(new AuthResponse(), response); // Merge with `AuthResponse`
	}

	/**
	 * Create a JSON response with the AuthResponse type.
	 * @param body - The body of the JSON response.
	 * @param init - Optional initialization options for the response.
	 * @returns An instance of AuthResponse with the JSON body.
	 */
	static withJson<JsonBody>(
		body: JsonBody,
		init?: ResponseInit
	): AuthResponse {
		const response = NextResponse.json(body, init); // Create a NextResponse
		Object.setPrototypeOf(response, AuthResponse.prototype); // Set the prototype
		return response as AuthResponse; // Explicitly cast the type
	}

	/**
	 * Create an error response with the AuthResponse type.
	 * @param body - The body of the error response.
	 * @param init - Optional initialization options for the response.
	 * @returns An instance of AuthResponse with the JSON body.
	 */
	static withError<JsonBody>(body: JsonBody, init?: ResponseInit) {
		const response = new NextResponse(JSON.stringify(body), {
			status: 400,
			...init,
		});
		Object.setPrototypeOf(response, AuthResponse.prototype); // Set the prototype
		return response as AuthResponse; // Explicitly cast the type
	}
}
