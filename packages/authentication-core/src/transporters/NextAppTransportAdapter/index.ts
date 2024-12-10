import { TransportAdapter } from "../types";
import { AuthState, CookieOptions } from "../../core/types";
import { cookies } from "next/headers";

export class NextAppTransportAdapter implements TransportAdapter {
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

	async storeAuthState(_response: any, authState: AuthState): Promise<void> {
		const cookieStore = await cookies(); // Await the promise to get the cookies object
		Object.entries(authState).forEach(([key, value]) => {
			value && cookieStore.set(key, value, this.options);
		});
	}

	async retrieveAuthState(_request: any): Promise<AuthState | null> {
		const cookieStore = await cookies(); // get the cookies object
		const accessToken = cookieStore.get("accessToken")?.value;
		const refreshToken = cookieStore.get("refreshToken")?.value;

		if (!accessToken && !refreshToken) {
			return null;
		}

		return {
			accessToken,
			refreshToken,
		};
	}

	async clearAuthState(_response: any): Promise<void> {
		const cookieStore = await cookies(); // Await the promise to get the cookies object
		cookieStore.delete("accessToken");
		cookieStore.delete("refreshToken");
	}
}
