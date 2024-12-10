import { WebStorageAdapter } from "../core/types";
// import { NextResponse } from "next/server";
import { CookieOptions } from "../core/types";
import { AuthTokens } from "../core/types";
import { CsrfOptions } from "../core/types";

export const createNextCookieAdapter = (
	options: CookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 7, // 1 week
	}
): WebStorageAdapter => {
	const createCookieString = (
		name: string,
		value: string,
		options: CookieOptions
	): string => {
		const cookieString = `${name}=${value}`;
		const optionStrings = Object.entries(options)
			.map(([key, value]) => `${key}=${value}`)
			.join("; ");
		return `${cookieString}; ${optionStrings}`;
	};

	return {
		storeTokens: async (tokens) => {
			// Handle client-side storage if needed
			// In Next.js with httpOnly cookies, we don't need to do anything here
			return Promise.resolve();
		},
		getStoredTokens: async () => {
			// This would be used in client-side code if needed
			// For httpOnly cookies, this will always return null
			return null;
		},
		clearTokens: async () => {
			// Handle client-side storage if needed
			// In Next.js with httpOnly cookies, we don't need to do anything here
			return Promise.resolve();
		},
		getCookieHeaders(tokens: AuthTokens): Record<string, string[]> {
			return {
				"Set-Cookie": [
					createCookieString(
						"auth-token",
						tokens.accessToken,
						options
					),
					createCookieString(
						"refresh-token",
						tokens.refreshToken,
						options
					),
				],
			};
		},
		getRemovalHeaders: () => {
			return {
				"Set-Cookie": [
					createCookieString("auth-token", "", {
						...options,
						maxAge: 0,
					}),
					createCookieString("refresh-token", "", {
						...options,
						maxAge: 0,
					}),
				],
			};
		},
	};
};

export const createCsrfProtection = (options: CsrfOptions): CsrfProtection => {
	return {
		generateCsrfToken(): string {
			return crypto.randomBytes(32).toString("hex");
		},

		addCsrfToken(response: NextResponse): NextResponse {
			const token = crypto.randomBytes(32).toString("hex");
			response.headers.append(
				"Set-Cookie",
				`csrf-token=${token}; Path=/; SameSite=Strict`
			);
			return response;
		},

		validateCsrfToken(request: Request): boolean {
			const cookieToken = request.cookies.get("csrf-token")?.value;
			const headerToken = request.headers.get("X-CSRF-Token");
			return cookieToken === headerToken;
		},
	};
};
