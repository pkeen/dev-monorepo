// import { NextResponse } from "next/server";
// // import { getAuthConfig } from "../../config/store";
// import type { AuthConfig } from "../../types/config";
// // import type { CookieOptions } from "../../types/config";

// interface CookieOptions {
// 	httpOnly?: boolean;
// 	secure?: boolean;
// 	path?: string;
// 	maxAge?: number;
// 	sameSite?: "strict" | "lax" | "none" | undefined;
// }

// export class AuthResponse extends NextResponse {
// 	private config: AuthConfig; // Store the config

// 	constructor(config: AuthConfig, init?: ResponseInit) {
// 		super();
// 		this.config = config; // Initialize config once
// 	}

// 	/**
// 	 * Sets a token as an HTTP-only cookie.
// 	 * @param token - The token to set.
// 	 * @param key? - Optional. The name of the cookie.
// 	 * @param options? - Optional Cookie options.
// 	 */
// 	setCookie(
// 		token: string,
// 		key: string = `${this.config.cookies.namePrefix}-token`,
// 		options: CookieOptions = {}
// 	): void {
// 		const cookieOptions: CookieOptions = {
// 			httpOnly: true,
// 			secure: process.env.NODE_ENV === "production",
// 			path: "/",
// 			maxAge: 3600,
// 			sameSite: "lax",
// 			...options,
// 		};
// 		this.cookies.set(key, token, cookieOptions);
// 	}
// 	setRefresh(token: string) {
// 		// this.setCookie(token, `${getAuthConfig().cookies.namePrefix}-refresh`);
// 		this.setCookie(token, this.config.cookies.namePrefix + "-refresh");
// 	}

// 	setAccess(token: string) {
// 		// this.setCookie(token, `${getAuthConfig().cookies.namePrefix}-access`);
// 		this.setCookie(token, this.config.cookies.namePrefix + "-access");
// 	}

// 	destroyCookie(
// 		key: string = `${this.config.cookies.namePrefix}-token`
// 	): void {
// 		this.cookies.set(key, "", { maxAge: 0 });
// 	}

// 	destroyRefresh(key?: string): void {
// 		key = key || `${this.config.cookies.namePrefix}-refresh`;
// 		this.destroyCookie(key);
// 	}

// 	destroyAccess(key?: string): void {
// 		key = key || `${this.config.cookies.namePrefix}-access`;
// 		this.destroyCookie(key);
// 	}

// 	/**
// 	 * Sets a csrf token as an HTTP-only cookie.
// 	 * @param csrf - The token to set.
// 	 * @param key? - Optional. The name of the cookie.
// 	 * @param options? - Optional Cookie options.
// 	 */
// 	setCsrf(
// 		csrf: string,
// 		key: string = `${this.config.cookies.namePrefix}-csrf`,
// 		options: CookieOptions = {}
// 	): void {
// 		const cookieOptions: CookieOptions = {
// 			httpOnly: true,
// 			secure: process.env.NODE_ENV === "production",
// 			path: "/",
// 			maxAge: 3600,
// 			sameSite: "lax",
// 			...options,
// 		};
// 		this.cookies.set(key, csrf, cookieOptions);
// 	}

// 	destroyCsrf(key?: string): void {
// 		key = key || `${getAuthConfig().cookies.namePrefix}-csrf`;
// 		console.log("Destroying csrf with key = ", key);
// 		this.cookies.set(key, "", { maxAge: 0 });
// 	}

// 	/**
// 	 * Creates a new ExtendedResponse with JSON data and sets a cookie.
// 	 * @param options - The options for creating the response.
// 	 * @returns An AuthResponse instance.
// 	 */
// 	static withCookie({
// 		cookie,
// 		cookieKey,
// 		status = 200,
// 		cookieOptions,
// 	}: {
// 		cookie: string;
// 		json?: Record<string, any>;
// 		cookieKey?: string;
// 		status?: number;
// 		cookieOptions?: CookieOptions;
// 	}): AuthResponse {
// 		const response = new AuthResponse({ status });
// 		response.setCookie(cookie, cookieKey, cookieOptions);
// 		return response;
// 	}

// 	static next(): AuthResponse {
// 		const response = NextResponse.next();
// 		return Object.assign(new AuthResponse(), response);
// 	}

// 	static withJson<JsonBody>(
// 		body: JsonBody,
// 		init?: ResponseInit
// 	): AuthResponse {
// 		const response = NextResponse.json(body, init);
// 		Object.setPrototypeOf(response, AuthResponse.prototype);
// 		return response as AuthResponse;
// 	}

// 	static withError<JsonBody>(body: JsonBody, init?: ResponseInit) {
// 		const response = new NextResponse(JSON.stringify(body), {
// 			status: 400,
// 			...init,
// 		});
// 		Object.setPrototypeOf(response, AuthResponse.prototype);
// 		return response as AuthResponse;
// 	}
// }

import { NextResponse } from "next/server";
import type { AuthConfig } from "../../types/config";

interface CookieOptions {
	httpOnly?: boolean;
	secure?: boolean;
	path?: string;
	maxAge?: number;
	sameSite?: "strict" | "lax" | "none" | undefined;
}

export class AuthResponse extends NextResponse {
	private config: AuthConfig;

	constructor(config: AuthConfig, init?: BodyInit | undefined) {
		super(init);
		this.config = config;
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
		this.setCookie(token, this.config.cookies.namePrefix + "-refresh");
	}

	setAccess(token: string) {
		this.setCookie(token, this.config.cookies.namePrefix + "-access");
	}

	setCsrf(token: string) {
		this.setCookie(token, this.config.cookies.namePrefix + "-csrf");
	}

	destroyCookie(key?: string): void {
		key = key || `${this.config.cookies.namePrefix}-token`;
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

	destroyCsrf(key?: string): void {
		key = key || `${this.config.cookies.namePrefix}-csrf`;
		this.destroyCookie(key);
	}

	// static withJson<T>(
	// 	data: T,
	// 	config: AuthConfig,
	// 	init?: BodyInit | undefined
	// ): AuthResponse {
	// 	const response = new AuthResponse(config, init);
	//     response.json
	// 	response.headers.set("Content-Type", "application/json");
	// 	const body = JSON.stringify(data);
	// 	const blob = new Blob([body], { type: "application/json" });
	// 	const readable = blob.stream();
	// 	return new Response(readable, response) as AuthResponse;
	// }

	static withCookie({
		config,
		init,
		cookie,
		cookieKey,
		status = 200,
		cookieOptions,
	}: {
		config: AuthConfig;
		init?: BodyInit | undefined;
		cookie: string;
		json?: Record<string, any>;
		cookieKey?: string;
		status?: number;
		cookieOptions?: CookieOptions;
	}): AuthResponse {
		const response = new AuthResponse(config, init);
		response.setCookie(cookie, cookieKey, cookieOptions);
		return response;
	}

	static withJson<T>(
		data: T,
		config: AuthConfig,
		init?: ResponseInit
	): AuthResponse {
		const headers = new Headers(init?.headers);
		headers.set("Content-Type", "application/json");

		const response = NextResponse.json(data, {
			...init,
			headers,
		});

		// Transfer the prototype and config
		Object.setPrototypeOf(response, AuthResponse.prototype);
		(response as AuthResponse).config = config;

		return response as AuthResponse;
	}

	static withError(
		message: string,
		config: AuthConfig,
		init?: ResponseInit
	): AuthResponse {
		return AuthResponse.withJson({ error: message }, config, {
			...init,
			status: init?.status || 400,
		});
	}

	static withSuccess(
		message: string,
		config: AuthConfig,
		init?: ResponseInit
	): AuthResponse {
		return AuthResponse.withJson({ message }, config, {
			...init,
			status: init?.status || 200,
		});
	}
}
