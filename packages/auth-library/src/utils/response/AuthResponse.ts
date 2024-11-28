import { NextResponse } from "next/server";
import { getAuthConfig } from "config";

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

	destroyCookie(
		key: string = `${this.config.cookies.namePrefix}-token`
	): void {
		this.cookies.set(key, "", { maxAge: 0 });
	}

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

	destroyCsrf(key: string = `${this.config.cookies.namePrefix}-csrf`): void {
		this.cookies.set(key, "", { maxAge: 0 });
	}

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
