import { NextResponse } from "next/server";
import { getAuthConfig } from "@config";

interface CookieOptions {
	httpOnly?: boolean;
	secure?: boolean;
	path?: string;
	maxAge?: number;
	sameSite?: "strict" | "lax" | "none" | undefined;
}

export class AuthResponse extends NextResponse {
	private config: ReturnType<typeof getAuthConfig>; // Store the config

	constructor(init?: ResponseInit) {
		super();
		this.config = getAuthConfig(); // Initialize config once
	}

	/**
	 * Sets a token as an HTTP-only cookie.
	 * @param token - The token to set.
	 * @param key? - Optional. The name of the cookie.
	 * @param options? - Optional Cookie options.
	 */
	setCookie(
		token: string,
		key: string = `${this.config.cookies.namePrefix}-token`,
		options: CookieOptions = {}
	): void {
		const cookieOptions: CookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 3600,
			sameSite: "lax",
			...options,
		};
		this.cookies.set(key, token, cookieOptions);
	}
	setRefresh(token: string) {
		// this.setCookie(token, `${getAuthConfig().cookies.namePrefix}-refresh`);
		this.setCookie(token, this.config.cookies.namePrefix + "-refresh");
	}

	setAccess(token: string) {
		// this.setCookie(token, `${getAuthConfig().cookies.namePrefix}-access`);
		this.setCookie(token, this.config.cookies.namePrefix + "-access");
	}

	destroyCookie(
		key: string = `${this.config.cookies.namePrefix}-token`
	): void {
		this.cookies.set(key, "", { maxAge: 0 });
	}

	destroyRefresh(key?: string): void {
		key = key || `${this.config.cookies.namePrefix}-refresh`;
		this.destroyCookie(key);
	}

	destroyAccess(key?: string): void {
		key = key || `${this.config.cookies.namePrefix}-access`;
		this.destroyCookie(key);
	}

	/**
	 * Sets a csrf token as an HTTP-only cookie.
	 * @param csrf - The token to set.
	 * @param key? - Optional. The name of the cookie.
	 * @param options? - Optional Cookie options.
	 */
	setCsrf(
		csrf: string,
		key: string = `${this.config.cookies.namePrefix}-csrf`,
		options: CookieOptions = {}
	): void {
		const cookieOptions: CookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			maxAge: 3600,
			sameSite: "lax",
			...options,
		};
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
		cookieKey,
		status = 200,
		cookieOptions,
	}: {
		cookie: string;
		json?: Record<string, any>;
		cookieKey?: string;
		status?: number;
		cookieOptions?: CookieOptions;
	}): AuthResponse {
		const response = new AuthResponse({ status });
		response.setCookie(cookie, cookieKey, cookieOptions);
		return response;
	}

	static next(): AuthResponse {
		const response = NextResponse.next();
		return Object.assign(new AuthResponse(), response);
	}

	static withJson<JsonBody>(
		body: JsonBody,
		init?: ResponseInit
	): AuthResponse {
		const response = NextResponse.json(body, init);
		Object.setPrototypeOf(response, AuthResponse.prototype);
		return response as AuthResponse;
	}

	static withError<JsonBody>(body: JsonBody, init?: ResponseInit) {
		const response = new NextResponse(JSON.stringify(body), {
			status: 400,
			...init,
		});
		Object.setPrototypeOf(response, AuthResponse.prototype);
		return response as AuthResponse;
	}
}
