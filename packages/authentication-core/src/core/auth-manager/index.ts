import {
	AuthResult,
	AuthStrategy,
	Logger,
	AuthConfig,
	KeyCards,
	AuthState,
	AuthNCallbacks,
} from "core/types";
import { SignInSystem, type SignInParams } from "../signin-system";
import { AuthProvider } from "core/providers";
import { Adapter as UserRegistry, AdapterUser } from "../adapter";
import { JwtStrategyFn } from "../session-strategy";
import { DisplayProvider } from "core/auth-system";
import { createLogger } from "@pete_keen/logger";
import { KeyCardMissingError } from "core/error";

export function AuthManager(
	userRegistry: UserRegistry,
	authStrategy: AuthStrategy,
	providers: AuthProvider[],
	logger: Logger,
	callbacks?: AuthNCallbacks
) {
	const providersMap = providers.reduce((acc, provider) => {
		acc[provider.key] = provider;
		return acc;
	}, {} as Record<string, AuthProvider>);
	const signInSystem = SignInSystem(providersMap);

	logger.info("Auth system initialized", {
		strategy: authStrategy.name,
		adapter: userRegistry.name,
	});

	// authz?.seed();

	return {
		login: async (provider?: string, code?: string) => {
			try {
				// 1) Authenticate with external provider (OAuth, etc.)
				logger.info("Authenticating with provider", {
					provider,
				});
				const signInResult = await signInSystem.signIn(provider, code);

				// 2) Deal with error or redirect result types
				if (signInResult.type === "error") {
					logger.error("Sign in failed", {
						error: signInResult.error,
					});
					return signInResult;
				} else if (signInResult.type === "redirect") {
					logger.info("Redirecting to external provider", {
						provider,
					});
					return signInResult;
				}

				if (signInResult.type !== "success") {
					throw new Error("Unknown sign in result type");
				}

				const { userProfile, adapterAccount } = signInResult.response;
				// 4): Check if user already exists - and deal with account user creation
				let user = await userRegistry.getUserByEmail(userProfile.email);
				// Step 2a: if not existing user create new one
				// TODO can this be cleaned up?
				if (!user) {
					logger.debug("User not found, creating new user", {
						email: userProfile.email,
					});
					user = await userRegistry.createUser({
						email: userProfile.email,
						name: userProfile.name,
						image: userProfile.image,
					});
					// TODO: create user account if not exists
					await userRegistry.createAccountForUser(
						user,
						adapterAccount
					);
					// Callback for user creation
					if (callbacks?.onUserCreated) {
						await callbacks.onUserCreated(user);
					}
				} else {
					// there is a user
					logger.debug("User found", {
						email: userProfile.email,
					});
					// Step 2b: Select account where user id matches and provider matches
					const account = await userRegistry.getAccount(
						adapterAccount.provider,
						adapterAccount.providerAccountId
					);

					// create user account if not exists
					if (account) {
						logger.debug("Account found", {
							provider: account.provider,
							providerAccountId: account.providerAccountId,
						});
						await userRegistry.updateAccount(adapterAccount);
					}

					// create user account if not exists
					if (!account) {
						logger.debug(
							"Account not found, creating new account",
							{
								provider: adapterAccount.provider,
								providerAccountId:
									adapterAccount.providerAccountId,
							}
						);
						await userRegistry.createAccountForUser(
							user,
							adapterAccount
						);
					}

					// TODO: should we also add a authz role if not exists?
					// I'm leaning towards probably yes
					// if not we should at least always assume the lowest level of access when role data not found
					// TODO: create default user authorization roles/permissions
					// const userRoles = await authz.getRolesForUser(user.id);
				}

				// 3) Enrich token or session data with roles/permissions (if authz is provided)
				// This is pointless in a db session strategy though
				// adding the if statment makes it only for jwt
				// this should perhaps be moved into the JWT Strategy as is only relevant there
				user = await callbacks.enrichUser(user);
				// TODO fix type mismathc

				// 4) Create the session (JWT or server-session) with user + extra data
				const keyCards = await authStrategy.createKeyCards(user);

				return {
					type: "success",
					authState: { authenticated: true, keyCards, user },
				};
			} catch (error) {
				logger.error("Error while signing in: ", {
					error,
				});
				return { type: "error", error };
			}
		},
		listProviders: () => {
			return providers.map((provider) => ({
				name: provider.name,
				key: provider.key,
				style: provider.style,
			}));
		},
		validate: async (keyCards: KeyCards): Promise<AuthResult> => {
			// TODO decide what works best for session strategy
			// TO-DO decide how to deal with missing keycards
			// its probably early on the game
			if (!keyCards) {
				return {
					type: "error",
					error: new KeyCardMissingError("No keycards found"),
				};
			}

			const result = await authStrategy.validate(keyCards);

			if (result.type === "success") {
				logger.info("Keycards validated", {
					userId: result.authState.user.id,
					email: result.authState.user.email,
				});
				return result;
			} else if (result.type === "refresh") {
				let user = await userRegistry.getUser(result.authState.user.id);

				// 3) Enrich token or session data with roles/permissions (if authz is provided)
				// This is pointless in a db session strategy though - this is not actually pointless in a db session strategy we should STILL enrich the USER object
				// no need for if
				user = await callbacks.enrichUser(user);
				// console.log("ENRICH USER CALLBACK RESULT:", user);
				// does this syntax work fine?
				// TODO: fix type issue adapter user vs User

				const keyCards = await authStrategy.createKeyCards(user);
				return {
					type: "refresh",
					authState: {
						user,
						authenticated: true,
						keyCards,
					},
				};
				// pull user info from DB
				// create new keycards
			}

			// console.log("AUTH.VALIDATE RESULT: ", result);
			if (result.type === "error") {
				// log the error
				this.logger.error("Failed to validate keycards", {
					message: result.error?.message,
				});
			}
			return result;
		},
		signOut: async (
			keyCards: KeyCards | undefined | null
		): Promise<AuthState> => {
			if (!keyCards) {
				return {
					authenticated: false,
					user: null,
					keyCards: null,
					error: null,
				}; // all ready logged out
			}
			return await authStrategy.logout(keyCards);
		},
		// authorize: async (keyCards: KeyCards, role?: string) => {
		// 	if (!keyCards) {
		// 		throw new KeyCardMissingError("No keycards found");
		// 	}

		// 	const validation = await authStrategy.validate(keyCards);

		// 	if (!role) {
		// 		return true;
		// 	}

		// 	if (validation.type === "error" || validation.type ===) {
		// 		return false;
		// 	}

		// 	return true;
		// },

		// Possibly other methods like signOut, refresh, etc.
	};
}

export const createAuthManager = (config: AuthConfig) => {
	let strategy: AuthStrategy;
	if (config.strategy === "jwt") {
		strategy = JwtStrategyFn(config.jwtConfig);
	} else if (config.strategy === "session") {
		throw new Error("Session strategy not implemented yet");
	} else {
		throw new Error("Invalid strategy");
	}

	if (!config.logger) {
		if (!config.loggerOptions) {
			config.loggerOptions = { level: "info", prefix: "Auth" };
		}
		config.logger = createLogger(config.loggerOptions);
	}

	const safeCallbacks: AuthNCallbacks = {
		onUserCreated: async () => {}, // No-op function
		onUserUpdated: async () => {}, // No-op function
		onUserDeleted: async () => {}, // No-op function
		enrichUser: async (user) => user, // Return user unchanged
		...config.callbacks, // Merge with user-defined callbacks (if any)
	};

	return AuthManager(
		config.adapter,
		strategy,
		config.providers,
		config.logger,
		safeCallbacks
	);
};

export interface AuthManager {
	login: (signInParams: SignInParams) => Promise<AuthResult>;
	listProviders: () => DisplayProvider[];
	validate: (keyCards: KeyCards) => Promise<AuthResult>;
	signOut: (keyCards: KeyCards) => Promise<AuthState>;
}
