// packages/auth-core/src/services/AuthenticationService.ts
import {
	AuthManager,
	AuthValidationResult,
	DatabaseUser,
	ImprovedAuthState,
	KeyCards,
} from "../types";
import { Credentials, SignupCredentials } from "../types";
// import { WebStorageAdapter } from "../types";
import { User } from "../types";
import { AuthStrategy } from "../types";
import { AuthState, AuthResult } from "../types";
import { UserRepository } from "../types";
import { Adapter, AdapterUser } from "../adapter";
import { DefaultPasswordService, PasswordService } from "../password-service";
import {
	createLogger,
	LogLevel,
	Logger,
	MultiTransportLogger,
	ConsoleTransport,
	FileTransport,
	createLogContext,
} from "@pete_keen/logger";
import {
	safeExecute,
	UserNotFoundError,
	KeyCardMissingError,
	InvalidCredentialsError,
    KeyCardCreationError
} from "../error";
import { is } from "drizzle-orm";

// Create logger with better naming
const defaultLogger = new MultiTransportLogger({
	level: "debug",
});
defaultLogger.addTransport(new ConsoleTransport());
// logger.addTransport(new FileTransport("/var/log/myapp"));

export class AuthSystem implements AuthManager {
	public logger: Logger;
	public strategy: AuthStrategy;
	// public userRepository: UserRepository;
	public adapter: Adapter;
	public passwordService: PasswordService;

	// storageAdapter: WebStorageAdapter; // Declare the storageAdapter property

	constructor(
		strategy: AuthStrategy,
		// userRepository: UserRepository
		adapter: Adapter,
		passwordService: PasswordService = DefaultPasswordService(),
		logger: Logger = defaultLogger
	) {
		this.strategy = strategy;
		// this.userRepository = userRepository;
		this.adapter = adapter;
		this.passwordService = passwordService;
		this.logger = logger;

		// Log initialization with structured metadata
		this.logger.info("Auth system initialized", {
			strategy: strategy.constructor.name,
			adapter: adapter.constructor.name,
			passwordService: passwordService.constructor.name,
		});
	}
	async authenticate(credentials: Credentials): Promise<ImprovedAuthState> {
		if (!this.validateCredentials(credentials)) {
			return { isLoggedIn: false };
		}

		const user = await this.findUser(credentials.email);
		if (!user) {
			return { isLoggedIn: false };
		}

		const isAuthenticated = await this.verifyPassword(
			credentials.password,
			user
		);
		if (!isAuthenticated) {
			return { isLoggedIn: false };
		}

		const keyCards = await this.createKeyCardsForUser(user);

		this.logger.info(
			"Authentication successful",
			createLogContext({
				userId: user.id,
				email: user.email,
			})
		);
		return { isLoggedIn: true, keyCards, user };

		// try {
		// 	this.logger.info("Authenticating user");
		// 	// Step 1: Validate input
		// 	if (!credentials.email || !credentials.password) {
		// 		this.logger.warn("Invalid credentials provided", {
		// 			missingFields: {
		// 				email: !credentials.email,
		// 				password: !credentials.password,
		// 			},
		// 		});
		// 		return { isLoggedIn: false };
		// 	}

		// 	// Find user
		// 	const user = await this.adapter.getUserByEmail(credentials.email);
		// 	if (!user) {
		// 		this.logger.info(
		// 			"Authentication failed - user not found",
		// 			logContext
		// 		);
		// 		return { isLoggedIn: false };
		// 	}

		// 	if (!user.password) {
		// 		this.logger.warn(
		// 			"Authentication failed - user has no password set",
		// 			{
		// 				...logContext,
		// 				userId: user.id,
		// 			}
		// 		);
		// 		return { isLoggedIn: false };
		// 	}

		// 	// step 2: verify password
		// 	const isAuthenticated = await this.passwordService.verify(
		// 		credentials.password,
		// 		user.password
		// 	);
		// 	if (!isAuthenticated) {
		// 		this.logger.info("Authentication failed - invalid password", {
		// 			...logContext,
		// 			userId: user.id,
		// 		});
		// 		return { isLoggedIn: false };
		// 	}

		// 	// step 3: create auth state
		// 	const keyCards = await this.strategy.createKeyCards(user);
		// 	this.logger.info("Authentication successful", {
		// 		...logContext,
		// 		userId: user.id,
		// 	});
		// 	return { isLoggedIn: true, keyCards, user };
		// } catch (error) {
		// 	this.logger.error("Authentication error", {
		// 		...logContext,
		// 		error: error instanceof Error ? error.message : "Unknown error",
		// 		stack: error instanceof Error ? error.stack : undefined,
		// 	});
		// 	return { isLoggedIn: false };
		// }
	}

	private validateCredentials(credentials: Credentials): boolean {
		if (!credentials.email || !credentials.password) {
			this.logger.warn("Invalid credentials provided", {
				missingFields: {
					email: !credentials.email,
					password: !credentials.password,
				},
			});
			return false;
		}
		return true;
	}

	// In your auth system
	private async findUser(email: string): Promise<AdapterUser | null> {
		const user = await safeExecute(
			async () => {
				const user = await this.adapter.getUserByEmail(email);
				console.log("DEBUG - Found user:", user); // Temporary debug log
				return user;
			},
			this.logger,
			{
				message: "Failed to fetch user",
				error: UserNotFoundError,
			},
			createLogContext({ email })
		);

		if (!user) {
			this.logger.warn("User not found", createLogContext({ email }));
		}
		return user;
	}

	private async verifyPassword(
		password: string,
		user: AdapterUser
	): Promise<boolean> {
		if (!user.password) {
			this.logger.error(
				"User has no password",
				createLogContext({ email: user.email, id: user.id })
			);
			return false;
		}

		const isAuthenticated = await safeExecute(
			async () => {
				return await this.passwordService.verify(
					password,
					user.password
				);
			},
			this.logger,
			{
				message: "Failed to verify password",
				error: UserNotFoundError,
			},
			createLogContext({ email: user.email, id: user.id })
		);
		return isAuthenticated;
	}

	private async createKeyCardsForUser(user: User): Promise<KeyCards> {
		return safeExecute(
			() => this.strategy.createKeyCards(user),
			this.logger,
			{
				message: "Failed to create keycards",
				error: KeyCardCreationError,
			},
			createLogContext({ email: user.email, id: user.id })
		);
	}

	async logout(keyCards: KeyCards): Promise<void> {
		// 1. Retrieve state from request
		// const authState = await this.transportAdapter.retrieveAuthState(
		// 	request
		// );
		// should be handled at application level
		if (!keyCards) {
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

	async refresh(keyCards: KeyCards): Promise<ImprovedAuthState> {
		// // optional supports refresh?
		// if (!this.strategy.supportsRefresh())
		// 	return Promise.resolve({ isLoggedIn: false });

		if (!keyCards) throw new Error("No key cards found");

		const validateResult = await this.strategy.validateRefresh(keyCards);
		console.log("validateResult: ", validateResult);

		if (validateResult.valid) {
			const user = await this.adapter.getUser(validateResult.user.id);
			console.log("user: ", user);
			const keyCards = await this.strategy.createKeyCards(user);
			return { isLoggedIn: true, keyCards, user };
		} else {
			return { isLoggedIn: false };
		}
	}

	async validate(keyCards: KeyCards): Promise<AuthValidationResult> {
		return this.strategy.validateAll(keyCards);
	}

	async signup(credentials: SignupCredentials): Promise<ImprovedAuthState> {
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
		const keyCards = await this.strategy.createKeyCards(user);

		// Step 6: Return the auth state
		return { isLoggedIn: true, keyCards, user };
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
