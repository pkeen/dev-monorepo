// packages/auth-core/src/services/AuthenticationService.ts
import {
	AuthManager,
	AuthValidationResult,
	DatabaseUser,
	ImprovedAuthState,
	JwtConfig,
	JwtOptions,
	KeyCards,
	SessionConfig,
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
	// FileTransport,
	createLogContext,
} from "@pete_keen/logger";
import {
	safeExecute,
	UserNotFoundError,
	KeyCardMissingError,
	InvalidCredentialsError,
	KeyCardCreationError,
	CsrfError,
} from "../error";
import { JwtStrategy } from "../strategy";
import crypto from "crypto";

export class AuthSystem implements AuthManager {
	public logger?: Logger;
	public strategy: AuthStrategy;
	// public userRepository: UserRepository;
	public adapter: Adapter;
	public passwordService: PasswordService;

	// storageAdapter: WebStorageAdapter; // Declare the storageAdapter property

	constructor(
		strategy: AuthStrategy,
		// userRepository: UserRepository
		adapter: Adapter,
		logger: Logger,
		passwordService: PasswordService = DefaultPasswordService()
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
		// Step 1: Validate input
		if (!this.validateCredentials(credentials)) {
			return { isLoggedIn: false };
		}

		// Step 2: Find user
		const user = await this.findUser(credentials.email);
		if (!user) {
			return { isLoggedIn: false };
		}

		// Step 3: Verify password
		const isAuthenticated = await this.verifyPassword(
			credentials.password,
			user
		);
		if (!isAuthenticated) {
			return { isLoggedIn: false };
		}

		// Step 4: Create auth state
		const keyCards = await this.createKeyCardsForUser(user);

		this.logger.info(
			"Authentication successful",
			createLogContext({
				userId: user.id,
				email: user.email,
			})
		);
		return { isLoggedIn: true, keyCards, user };
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

	async logout(keyCards: KeyCards | undefined): Promise<void> {
		if (!keyCards) {
			return; // all ready logged out
		}
		await this.strategy.logout(keyCards);
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
		const result = await safeExecute(
			async () => {
				return await this.strategy.validate(keyCards);
			},
			this.logger,
			{
				message: "Failed to validate keycards",
				error: InvalidCredentialsError,
			}
		);
		if (!result.isAuthenticated) {
			return { isAuthenticated: false, user: null };
		}
		return result;
	}

	async signup(credentials: Credentials): Promise<ImprovedAuthState> {
		// return this.strategy.signup(credentials);
		// Step 1: Validate input

		try {
			console.log("sign up credentials:", credentials);

			// Step 2: Check if user already exists
			const existingUser = await this.adapter.getUserByEmail(
				credentials.email
			);
			if (existingUser) {
				console.log("user already exists");
				throw new Error(
					"An account with that email is already registered"
				);
				// console.error("An account with that email is already registered");
				// return { isLoggedIn: false };
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
		} catch (error) {
			return { isLoggedIn: false };
		}
	}

	async generateCsrfToken(): Promise<string> {
		return crypto.randomBytes(32).toString("hex");
	}

	// Validate a CSRF token
	async validateCsrfToken(
		requestToken: string,
		storedToken: string
	): Promise<void> {
		if (!requestToken || requestToken !== storedToken) {
			throw new CsrfError("Invalid CSRF token");
		}
	}

	static create(config: AuthConfig): AuthSystem {
		let strategy: AuthStrategy;
		if (config.strategy === "jwt") {
			strategy = new JwtStrategy(config.jwtConfig);
		} else if (config.strategy === "session") {
			throw new Error("Session strategy not implemented yet");
		} else {
			throw new Error("Invalid strategy");
		}

		const logger = createLogger(config.logger);

		if (!config.adapter) {
			logger.warn("You will be using no persistence adapter");
		}

		return new AuthSystem(strategy, config.adapter, logger);
	}
}

export interface LoggerOptions {
	level?: LogLevel;
	filepath?: string; // If they want file logging
	silent?: boolean; // Disable console logging
	// format?: LogFormat; // Log format
}

export interface AuthConfigBase {
	adapter?: Adapter;
	// passwordService?: string;
	logger?: LoggerOptions;
}

export type AuthConfig =
	| (AuthConfigBase & { strategy: "jwt"; jwtConfig: JwtConfig })
	| (AuthConfigBase & { strategy: "session"; sessionConfig: SessionConfig });
// | (AuthConfigBase & { strategy: "hybrid"; hybridConfig: HybridConfig });

// export const createAuthSystem = (config: AuthConfig): AuthSystem => {
// 	let strategy: AuthStrategy;
// 	if (config.strategy === "jwt") {
// 		strategy = new JwtStrategy(config.jwtConfig);
// 	} else if (config.strategy === "session") {
// 		throw new Error("Session strategy not implemented yet");
// 	} else {
// 		throw new Error("Invalid strategy");
// 	}

// 	const logger = createLogger(config.logger);

// 	if (!config.adapter) {
// 		logger.warn("You will be using no persistence adapter");
// 	}

// 	return new AuthSystem(strategy, config.adapter, logger);
// };
