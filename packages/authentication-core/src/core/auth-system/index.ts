// packages/auth-core/src/services/AuthenticationService.ts
import { AuthManager, AuthValidationResult } from "../types";
import { Credentials } from "../types";
// import { WebStorageAdapter } from "../types";
import { User } from "../types";
import { AuthStrategy } from "../types";
import { TransportAdapter } from "../../transporters/types";
import { AuthState, AuthResult } from "../types";
import { UserRepository } from "../types";
import { Adapter } from "../adapter";
import { DefaultPasswordService, PasswordService } from "../password-service";

export class AuthSystem implements AuthManager {
	public strategy: AuthStrategy;
	public transportAdapter: TransportAdapter;
	// public userRepository: UserRepository;
	public adapter: Adapter;
	public passwordService: PasswordService;

	// storageAdapter: WebStorageAdapter; // Declare the storageAdapter property

	constructor(
		strategy: AuthStrategy,
		transportAdapter: TransportAdapter,
		// userRepository: UserRepository
		adapter: Adapter,
		passwordService: PasswordService = DefaultPasswordService()
	) {
		this.strategy = strategy;
		this.transportAdapter = transportAdapter;
		// this.userRepository = userRepository;
		this.adapter = adapter;
		this.passwordService = passwordService;
	}
	async authenticate(credentials: Credentials): Promise<AuthResult> {
		// validation of credentials
		console.log("credentials:", credentials);
		if (!credentials.email || !credentials.password) {
			return { success: false };
		}
		try {
			// step 1: find user by email
			const user = await this.adapter.getUserByEmail(credentials.email);
			console.log("user:", user);
			if (!user) {
				console.log("user not found");
				return { success: false };
			} else if (user.password === null) {
				console.log("user has no password");
				return { success: false };
			}

			// step 2: verify password
			const isAuthenticated = await this.passwordService.verify(
				credentials.password,
				user.password
			);
			if (!isAuthenticated) {
				return { success: false };
			}
			// if (user.password !== credentials.password) {
			// 	return { success: false };
			// }

			// step 3: create auth state
			const authState = await this.strategy.createAuthState(user);
			return { success: true, authState };
		} catch (error) {
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

	async refresh(authState: AuthState): Promise<AuthState> {
		if (!this.strategy.supportsRefresh()) {
			throw new Error(
				"Refresh token flow not supported by this strategy."
			);
		}
		return this.strategy.refresh(authState);
	}

	async validate(authState: AuthState): Promise<AuthValidationResult> {
		return this.strategy.validate(authState);
	}

	async signup(credentials: Credentials): Promise<AuthState> {
		return this.strategy.signup(credentials);
	}
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
