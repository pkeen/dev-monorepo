import { SessionStateStorage } from "../core/session-state-storage/session-state-storage";
// import { ImprovedAuthState, CookieOptions } from "../../core/types";
import {
	CookieOptions,
	AuthTokens,
} from "../../../authentication-core/src/core/types";
import { cookies } from "next/headers";

export class NextSessionStateStorage implements SessionStateStorage {
	private options: CookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 3600,
		sameSite: "lax",
	};
	constructor(options?: CookieOptions) {
		if (options) {
			this.options = options;
		}
	}

	async storeAuthState(
		authTokens: AuthTokens,
		_response?: any
	): Promise<void> {
		const cookieStore = await cookies(); // Await the promise to get the cookies object
		Object.entries(authTokens).forEach(([key, value]) => {
			value.value && cookieStore.set(key, value.value, this.options);
		});
	}

	async retrieveAuthState(_request: any): Promise<AuthTokens | null> {
		const cookieStore = await cookies();

		// Get all possible token types
		const tokens: AuthTokens = {};
		const possibleTokens = [
			"accessToken",
			"refreshToken",
			"sessionId",
			"csrfToken",
		] as const;

		// Try to get each token
		for (const tokenName of possibleTokens) {
			const token = cookieStore.get(tokenName)?.value;
			if (token) {
				tokens[tokenName] = {
					value: token,
					name: tokenName,
					// Note: We could add expiresAt if the cookie has an expires value
				};
			}
		}

		// Only return null if we found no tokens at all
		return Object.keys(tokens).length > 0 ? tokens : null;
	}

	async clearAuthState(_response: any): Promise<void> {
		const cookieStore = await cookies(); // Await the promise to get the cookies object
		cookieStore.delete("accessToken");
		cookieStore.delete("refreshToken");
		cookieStore.delete("sessionId");
		cookieStore.delete("csrfToken");
	}
}
