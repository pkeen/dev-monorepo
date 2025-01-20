import crypto from "crypto";
import { IOAuthProvider, OAuthProviderConfig } from "./index.types";

export abstract class AbstractOAuthProvider<ScopeType extends string>
	implements IOAuthProvider
{
	public abstract readonly name: string;
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
	protected abstract minimumScopes: ScopeType[];

	protected constructor(config: OAuthProviderConfig<ScopeType>) {
		this.clientId = config.clientId;
		this.clientSecret = config.clientSecret;
		this.redirectUri = config.redirectUri;
	}

	// abstract createAuthorizationUrl(): string;

	public getState(): string {
		return this.state;
	}
	abstract getScopes(): string;

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
		// const scopeMap = this.getScopeMap();

		// Combine minimum and additional scopes
		const combinedScopes = [...this.minimumScopes, ...scopes];

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
		const params = new URLSearchParams({
			client_id: this.clientId,
			redirect_uri: this.redirectUri,
			response_type: "code",
			scope: scopeString,
			// Add other common parameters as needed
		});
		return `${this.authorizeEndpoint}?${params.toString()}`;
	}

	// Handle callback - to be implemented by subclasses
	abstract validateAuthorizationCode(
		authorizationCode: string
	): Promise<Record<string, any>>;
}
