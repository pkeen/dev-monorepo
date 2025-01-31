import crypto from "crypto";
import { IOAuthProvider } from "./index.types";
import { UserProfile } from "core/types";
import { AdapterAccount } from "core/adapter";
import { createEmitAndSemanticDiagnosticsBuilderProgram } from "typescript";
import { z } from "zod";

export abstract class AbstractOAuthProvider<
	ScopeType extends string,
	TokenType,
	ProfileType
> implements IOAuthProvider
{
	public abstract readonly key: string;
	public abstract readonly name: string;
	public abstract readonly type: "oauth" | "oidc";

	protected clientId: string;
	protected clientSecret: string;
	protected redirectUri: string;

	// Minimum scopes required by the application
	protected abstract authorizeEndpoint: string;
	protected abstract tokenEndpoint: string;
	// protected abstract scopes: ScopeType[];
	protected abstract scopeMap: Record<ScopeType, string>;
	protected state = crypto.randomBytes(32).toString("hex");

	// Minimum scopes required by the application
	protected abstract defaultScopes: ScopeType[];

	protected constructor(config: OAuthProviderConfig) {
		this.clientId = config.clientId;
		this.clientSecret = config.clientSecret;
		this.redirectUri = config.redirectUri;
	}

	public getState(): string {
		return this.state;
	}
	// abstract getScopes(): string;

	// public generateState(): string {
	// 	const state =
	// 	return state;
	// }

	/**
	 * Transforms and validates scopes using the provider-specific scope map.
	 * @param scopes Additional scopes provided by the user.
	 * @returns A space-separated string of mapped scopes.
	 */
	protected transformScopes(scopes: ScopeType[]): string {
		// Combine minimum and additional scopes
		const combinedScopes = [...this.defaultScopes, ...scopes];
		// Remove duplicates
		const uniqueScopes = Array.from(new Set(combinedScopes));

		return uniqueScopes
			.map((scope) => {
				const mappedScope = this.scopeMap[scope];
				if (!mappedScope) {
					throw new Error(`Invalid scope: ${scope}`);
				}
				return mappedScope;
			})
			.join(" ");
	}

	/**
	 * Creates the authorization URL with combined scopes.
	 * @param additionalScopes Additional scopes provided by the user.
	 * @returns The complete authorization URL.
	 */
	public createAuthorizationUrl(additionalScopes: ScopeType[] = []): string {
		const scopeString = this.transformScopes(additionalScopes);
		console.log("CLIENT ID:", this.clientId);
		const params = new URLSearchParams({
			client_id: this.clientId,
			redirect_uri: this.redirectUri,
			response_type: "code",
			scope: scopeString,
			state: this.state,
			// Add other common parameters as needed
		});
		return `${this.authorizeEndpoint}?${params.toString()}`;
	}

	// Handle callback - to be implemented by subclasses
	abstract exchangeCodeForTokens(
		authorizationCode: string
	): Promise<Record<string, any>>;

	/**
	 * Handle callback - main authorization flow after redirect from provider
	 * @param code
	 * @returns
	 */
	abstract handleRedirect(code: string): Promise<OAuthProviderResponse>;

	protected convertExpiresInToExpiresAt(expiresIn: number): number {
		return Math.floor(Date.now() / 1000) + expiresIn; // If given as seconds remaining - I also want to store as seconds not miliseconds
	}
	// TODO: Implement refresh tokens

	protected abstract convertToAdapterAccount(
		providerAccountId: string,
		tokens: Record<string, any>
	): Omit<AdapterAccount, "userId">;

	/**
	 * How to get user profile
	 * This will vary depending on the provider
	 * @param tokens
	 * @returns
	 */
	abstract getUserProfile(tokens: TokenType): Promise<UserProfile>;
}

export interface OAuthProviderConfig {
	// name: string; // Unique identifier for the provider
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

export interface OAuthProviderResponse {
	userProfile: UserProfile;
	adapterAccount: Omit<AdapterAccount, "userId">;
	// tokens: Record<string, any>;
}

export const OIDCBaseTokenSchema = z.object({
	sub: z.string(),
	iss: z.string(),
	aud: z.string(),
	exp: z.number(),
	iat: z.number(),
	email: z.string().email(),
	name: z.string(),
});

export const BaseOAuthTokenSchema = z.object({
	access_token: z.string(),
	token_type: z.string(),
	expires_in: z.number().optional(),
	refresh_token: z.string().optional(),
	scope: z.string().optional(),
	id_token: z.string().optional(),
});
