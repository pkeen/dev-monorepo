// packages/auth-core/src/services/AuthenticationService.ts
import { AuthManager, AuthValidationResult, ImprovedAuthState } from "../types";
import { Credentials, SignupCredentials } from "../types";
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
	// public userRepository: UserRepository;
	public adapter: Adapter;
	public passwordService: PasswordService;

	// storageAdapter: WebStorageAdapter; // Declare the storageAdapter property

	constructor(
		strategy: AuthStrategy,
		// userRepository: UserRepository
		adapter: Adapter,
		passwordService: PasswordService = DefaultPasswordService()
	) {
		this.strategy = strategy;
		// this.userRepository = userRepository;
		this.adapter = adapter;
		this.passwordService = passwordService;
	}
	async authenticate(credentials: Credentials): Promise<ImprovedAuthState> {
		try {
			// Step 1: Validate input
			console.log("credentials:", credentials);
			if (!credentials.email || !credentials.password) {
				return { isLoggedIn: false };
			}

			// step 1: find user by email
			const user = await this.adapter.getUserByEmail(credentials.email);
			console.log("user:", user);
			if (!user) {
				console.log("user not found");
				return { isLoggedIn: false };
			} else if (user.password === null) {
				console.log("user has no password");
				return { isLoggedIn: false };
			}

			// step 2: verify password
			const isAuthenticated = await this.passwordService.verify(
				credentials.password,
				user.password
			);
			if (!isAuthenticated) {
				return { isLoggedIn: false };
			}
			// if (user.password !== credentials.password) {
			// 	return { success: false };
			// }

			// step 3: create auth state
			const tokens = await this.strategy.createAuthTokens(user);
			return { isLoggedIn: true, tokens, user };
		} catch (error) {
			return { isLoggedIn: false };
		}
	}

	async logout(authState: ImprovedAuthState): Promise<void> {
		// 1. Retrieve state from request
		// const authState = await this.transportAdapter.retrieveAuthState(
		// 	request
		// );
		// should be handled at application level
		if (!authState) {
			return; // all ready logged out
		}

		// Perhaps we should have if (authState.strategy === 'session')
		// go to database and delete the session

		// 2. If we have a refresh token or session ID, pass it to the strategy
		// if (authState.refreshToken) {
		// 	await this.strategy.logout(authState.refreshToken);
		// } else if (authState?.sessionId) {
		// 	await this.strategy.logout(authState.sessionId);
		// }

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

	async signup(credentials: SignupCredentials): Promise<AuthState> {
		// return this.strategy.signup(credentials);
		// Step 1: Validate input
		console.log("sign up credentials:", credentials);

		// Step 2: Check if user already exists
		const existingUser = await this.adapter.getUserByEmail(
			credentials.email
		);
		if (existingUser) {
			console.log("user already exists");
			throw new Error("An account with that email is already registered");
		}

		// Step 3: Hash the password
		const hashedPassword = await this.passwordService.hash(
			credentials.password
		);
		credentials.password = hashedPassword;

		// Step 4: Create the user
		const user = await this.adapter.createUserWithoutId(credentials);

		// Step 5: Create the auth state
		const authState = await this.strategy.createAuthState(user);

		// Step 6: Return the auth state
		return authState;
		// return { accessToken: "", refreshToken: "" };
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
