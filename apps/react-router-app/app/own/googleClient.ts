import * as crypto from "crypto";

// Using a Union Type for flexibility
type Scope =
	| "openid"
	| "profile"
	| "email"
	| "driveMetadataReadonly"
	| "calendarReadonly";
// Add more scopes as needed

const ScopeMap: Record<Scope, string> = {
	openid: "openid", // OIDC scope
	profile: "https://www.googleapis.com/auth/userinfo.profile",
	email: "https://www.googleapis.com/auth/userinfo.email",
	driveMetadataReadonly:
		"https://www.googleapis.com/auth/drive.metadata.readonly",
	calendarReadonly: "https://www.googleapis.com/auth/calendar.readonly",
	// Add more mappings as needed
};

// function transformScopes(scopes: Scope[]): string {
// 	return scopes
// 		.map((scope) => {
// 			const mappedScope = ScopeMap[scope];
// 			if (!mappedScope) {
// 				throw new Error(`Invalid scope: ${scope}`);
// 			}
// 			return mappedScope;
// 		})
// 		.join(" ");
// }

// function encodeScopes(scopes: Scope[]): string {
// 	const transformed = transformScopes(scopes);
// 	return encodeURIComponent(transformed);
// }

// export function googleClient() {
// 	const clientId = process.env.GOOGLE_CLIENT_ID!;
// 	const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
// 	const authorizeEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
// 	const tokenEndpoint = "https://oauth2.googleapis.com/token";
// 	// how do we deal with scopes
// 	const scopes: Scope[] = ["openid", "profile", "email"];
// 	// ^ this will somehow need to come from google
// 	const encodedScopes = encodeScopes(scopes);
// 	console.log(encodedScopes);
// 	// Generate a secure random state value.
// 	const state = crypto.randomBytes(32).toString("hex");

// 	const authorizeUrl = new URL(authorizeEndpoint);
// 	authorizeUrl.searchParams.set("client_id", clientId);
// 	authorizeUrl.searchParams.set(
// 		"redirect_uri",
// 		"http://localhost:5173/auth/callback/google"
// 	);
// 	authorizeUrl.searchParams.set("response_type", "code");
// 	authorizeUrl.searchParams.set("scope", encodedScopes);
// 	authorizeUrl.searchParams.set("state", state);

// 	// const client = new oslo.OAuth2Client(
// 	// 	clientId,
// 	// 	clientSecret,
// 	// 	authorizeEndpoint,
// 	// 	tokenEndpoint,
// 	// 	{
// 	// 		redirectURI: "http://localhost:5173/auth/callback/google",
// 	// 	}
// 	// );

// 	// return client;
// }

export class GoogleClient {
	private clientId: string;
	private clientSecret: string;
	private redirectUri: string;
	private authorizeEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
	private tokenEndpoint = "https://oauth2.googleapis.com/token";
	private scopes: Scope[] = ["openid", "profile", "email"];
	private state = crypto.randomBytes(32).toString("hex");
	public name = "Google";

	constructor(config: {
		clientId: string;
		clientSecret: string;
		redirectUri: string;
	}) {
		const { clientId, clientSecret, redirectUri } = config;
		this.clientId = clientId;
		this.clientSecret = clientSecret;
		this.redirectUri = redirectUri;
	}

	createAuthorizationUrl(): string {
		const authorizeUrl = new URL(this.authorizeEndpoint);
		authorizeUrl.searchParams.set("client_id", this.clientId);
		authorizeUrl.searchParams.set("redirect_uri", this.redirectUri);
		authorizeUrl.searchParams.set("response_type", "code");
		authorizeUrl.searchParams.set(
			"scope",
			this.transformScopes(this.scopes)
		);
		authorizeUrl.searchParams.set("state", this.state);
		return authorizeUrl.toString();
	}

	getState(): string {
		return this.state;
	}

	getScopes(): string {
		return this.transformScopes(this.scopes);
	}

	/**
	 * Transforms an array of short scope names into a space-separated string of full scope URLs.
	 * @param scopes - Array of short scope names.
	 * @returns Space-separated string of full scope URLs.
	 */
	private transformScopes(scopes: Scope[]): string {
		return scopes
			.map((scope) => {
				const mappedScope = ScopeMap[scope];
				if (!mappedScope) {
					throw new Error(`Invalid scope: ${scope}`);
				}
				return mappedScope;
			})
			.join(" ");
	}

	async validateAuthorizationCode(
		authorizationCode: string
	): Promise<Record<string, any>> {
		const tokenUrl = new URL(this.tokenEndpoint);
		tokenUrl.searchParams.set("client_id", this.clientId);
		tokenUrl.searchParams.set("client_secret", this.clientSecret);
		tokenUrl.searchParams.set("redirect_uri", this.redirectUri);
		tokenUrl.searchParams.set("grant_type", "authorization_code");
		tokenUrl.searchParams.set("code", authorizationCode);
		const data = await fetch(tokenUrl.toString(), {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});
		return data.json();
	}

	// /**
	//  * Encodes the transformed scopes for use in a URL.
	//  * @param scopes - Array of short scope names.
	//  * @returns URL-encoded scope string.
	//  */
	// // NOT NEEDED TO ENCODE THEM
	// encodeScopes(scopes: Scope[]): string {
	// 	const transformed = this.transformScopes(scopes);
	// 	return encodeURIComponent(transformed);
	// }

	// generateState(): string {
	// 	return crypto.randomBytes(32).toString("hex");
	// }
}
