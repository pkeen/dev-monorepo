// packages/auth-core/src/services/AuthenticationService.ts
import { AuthManager } from "../types";
import { Credentials } from "../types";
import { WebStorageAdapter } from "../types";
import { User } from "../types";
import { AuthStrategy } from "../types";
import { TransportAdapter } from "../../transporters/types";
import { AuthState } from "../types";

type AuthResult = {
	success: boolean;
	authState?: AuthState;
};

export class AuthSystem implements AuthManager {
	public strategy: AuthStrategy;
	public transportAdapter: TransportAdapter;
	// storageAdapter: WebStorageAdapter; // Declare the storageAdapter property

	constructor(strategy: AuthStrategy, transportAdapter: TransportAdapter) {
		this.strategy = strategy;
		this.transportAdapter = transportAdapter;
	}
	async authenticate(credentials: Credentials): Promise<AuthResult> {
		if (
			credentials.email === "pkeen7@gmail.com" &&
			credentials.password === "password"
		) {
			const authState = await this.strategy.createAuthState({
				id: 1,
				email: "pkeen7@gmail.com",
				// roles: ["user", "admin"],
			});
			return {
				success: true,
				authState,
			};
		} else {
			return { success: false };
		}
	}

	async logout(request: Request, response: Response): Promise<void> {
		// 1. Retrieve state from request
		const authState = await this.transportAdapter.retrieveAuthState(
			request
		);
		if (!authState) {
			return; // all ready logged out
		}

		// 2. If we have a refresh token or session ID, pass it to the strategy
		if (authState.refreshToken) {
			await this.strategy.logout(authState.refreshToken);
		} else if (authState?.sessionId) {
			await this.strategy.logout(authState.sessionId);
		}

		// 3. Clear auth state from client
		this.transportAdapter.clearAuthState(response);

		// Return response or handle it in the route
	}

	// async createRole(name: string, permissions: string[]): Promise<void> {
	// 	return Promise.resolve();
	// }

	// // Add more methods as needed
	// createRole(name: string, permissions: string[]) {
	// 	console.log(`Role "${name}" created with permissions: ${permissions}`);
	// }

	// listPolicies() {
	// 	return Object.keys(this.policies);
	// }
}

// export const createAuthService = (
// 	storageAdapter: WebStorageAdapter
// ): AuthManager => {
// 	return {
// 		authenticate(credentials: Credentials): Promise<AuthResult> {
// 			if (
// 				credentials.email === "pkeen7@gmail.com" &&
// 				credentials.password === "password"
// 			) {
// 				return Promise.resolve({ success: true });
// 			} else {
// 				return Promise.resolve({ success: false });
// 			}
// 		},
// 		logout(userId: string): Promise<void> {
// 			return Promise.resolve();
// 		},
// 		storageAdapter: storageAdapter,
// 	};
// };
