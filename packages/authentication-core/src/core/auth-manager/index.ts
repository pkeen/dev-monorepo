import { AuthResult, AuthStrategy } from "core/types";
import { SignInSystem, type SignInParams } from "../signin-system";
import { AuthProvider } from "core/providers";
import { Authz, AuthzData } from "../../authorization/index.types";
import { Adapter as UserRegistry, AdapterUser } from "../adapter";
import { AuthConfig } from "../auth-system/index.types";
import { JwtStrategyFn } from "../session-strategy";
import { DisplayProvider } from "core/auth-system";

export function AuthManager(
	userRegistry: UserRegistry,
	authStrategy: AuthStrategy,
	providers: AuthProvider[],
	authz?: Authz // optional, if you want role-based enrichment
) {
	const providersMap = providers.reduce((acc, provider) => {
		acc[provider.key] = provider;
		return acc;
	}, {} as Record<string, AuthProvider>);

	authz?.seed();

	const signInSystem = SignInSystem(providersMap);

	return {
		login: async (provider?: string, code?: string) => {
			try {
				// 1) Authenticate with external provider (OAuth, etc.)
				const signInResult = await signInSystem.signIn(provider, code);

				// 2) Deal with error or redirect result types
				if (
					signInResult.type === "error" ||
					signInResult.type === "redirect" ||
					signInResult.type !== "success"
				) {
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
					// logger.info("User not found, creating new user", {
					// 	email: userProfile.email,
					// });
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

					// TODO: create default user authorization roles/permissions
					await authz.createUserRole(user.id);
				} else {
					// this.logger.info("User found", {
					// 	email: userProfile.email,
					// });
					// Step 2b: Select account where user id matches and provider matches
					const account = await userRegistry.getAccount(
						adapterAccount.provider,
						adapterAccount.providerAccountId
					);

					// create user account if not exists
					if (account) {
						// this.logger.info("Account found", {
						// 	provider: account.provider,
						// 	providerAccountId: account.providerAccountId,
						// });
						// Has token changed check - temporary
						if (
							account.access_token === adapterAccount.access_token
						) {
							console.log("SAME TOKEN");
						} else {
							console.log("DIFFERENT TOKEN");
						}
						await userRegistry.updateAccount(adapterAccount);
					}

					// create user account if not exists
					if (!account) {
						await userRegistry.createAccountForUser(
							user,
							adapterAccount
						);
					}
				}

				// 3) Enrich token or session data with roles/permissions (if authz is provided)
				// This is pointless in a db session strategy though
				let authzData: AuthzData = {};
				if (authz && authz.enrichToken) {
					authzData = await authz.enrichToken(user.id);
					user = {
						...user,
						...authzData,
					};
				}

				// 4) Create the session (JWT or server-session) with user + extra data
				const session = await authStrategy.createKeyCards(user);

				return {
					type: "success",
					authState: { authenticated: true, session, user },
				};
			} catch (error) {
				// this.logger.error("Error while signing in: ", {
				// 	error,
				// });
				console.log("Error while signing in: ", error);
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

	return AuthManager(
		config.adapter,
		strategy,
		config.providers,
		config.authz
	);
};

export interface AuthManager {
	signIn: (signInParams: SignInParams) => Promise<AuthResult>;
	listProviders: () => DisplayProvider[];
}
