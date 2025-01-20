import { AuthProvider, SignInParams, ProviderAuthResult } from "./types";

interface GoogleUserProfile {
	id: string;
	email: string;
	verified_email: boolean;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	locale: string;
}

interface GoogleTokens {
	access_token: string;
	expires_in: number;
	refresh_token?: string;
	scope: string;
	token_type: string;
	id_token: string;
}

interface GoogleOAuthConfig {
	clientId: string;
	clientSecret: string;
	// Optional configurations
	scopes?: string[];
	accessType?: "online" | "offline";
	prompt?: "none" | "consent" | "select_account";
}

export class GoogleOAuthProvider implements AuthProvider {
	readonly type = "google";
	readonly name = "Google";

	private readonly defaultScopes = [
		"https://www.googleapis.com/auth/userinfo.profile",
		"https://www.googleapis.com/auth/userinfo.email",
	];

	constructor(private config: GoogleOAuthConfig) {
		this.config.scopes = config.scopes || this.defaultScopes;
		this.config.accessType = config.accessType || "offline";
		this.config.prompt = config.prompt || "consent";
	}

	async signIn(params: SignInParams): Promise<ProviderAuthResult> {
		const { code, redirectUrl } = params;

		if (!code) {
			// If no code is provided, return the authorization URL
			const authUrl = this.buildAuthorizationUrl(redirectUrl as string);
			throw new AuthRedirectError(authUrl);
		}

		// Exchange code for tokens
		const tokens = await this.getTokensFromCode(
			code as string,
			redirectUrl as string
		);

		// Verify ID token
		await this.verifyIdToken(tokens.id_token);

		// Get user profile
		const profile = await this.getUserProfile(tokens.access_token);

		return {
			providerId: profile.id,
			accessToken: tokens.access_token,
			profile: {
				email: profile.email,
				name: profile.name,
				picture: profile.picture,
				givenName: profile.given_name,
				familyName: profile.family_name,
				emailVerified: profile.verified_email,
			},
			raw: {
				tokens,
				profile,
			},
		};
	}

	async verify(credentials: unknown): Promise<boolean> {
		if (!this.isGoogleCredentials(credentials)) {
			return false;
		}

		try {
			await this.verifyIdToken(credentials.id_token);
			return true;
		} catch {
			return false;
		}
	}

	private buildAuthorizationUrl(redirectUrl: string): string {
		const params = new URLSearchParams({
			client_id: this.config.clientId,
			redirect_uri: redirectUrl,
			response_type: "code",
			access_type: this.config.accessType,
			prompt: this.config.prompt,
			scope: this.config.scopes.join(" "),
		});

		return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
	}

	private async getTokensFromCode(
		code: string,
		redirectUrl: string
	): Promise<GoogleTokens> {
		const params = new URLSearchParams({
			client_id: this.config.clientId,
			client_secret: this.config.clientSecret,
			code,
			grant_type: "authorization_code",
			redirect_uri: redirectUrl,
		});

		const response = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: params.toString(),
		});

		if (!response.ok) {
			throw new Error("Failed to get tokens from Google");
		}

		return response.json();
	}

	private async getUserProfile(
		accessToken: string
	): Promise<GoogleUserProfile> {
		const response = await fetch(
			"https://www.googleapis.com/oauth2/v2/userinfo",
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to get Google user profile");
		}

		return response.json();
	}

	private async verifyIdToken(idToken: string): Promise<void> {
		// In a production environment, you should verify the ID token's signature
		// using Google's public keys and verify all claims
		// For demonstration, we'll just decode and do basic validation
		const [headerB64, payloadB64, signature] = idToken.split(".");

		if (!headerB64 || !payloadB64 || !signature) {
			throw new Error("Invalid ID token format");
		}

		const payload = JSON.parse(
			Buffer.from(payloadB64, "base64").toString()
		);

		// Verify basic claims
		const now = Math.floor(Date.now() / 1000);

		if (payload.exp < now) {
			throw new Error("ID token has expired");
		}

		if (payload.aud !== this.config.clientId) {
			throw new Error("Invalid audience");
		}

		if (payload.iss !== "https://accounts.google.com") {
			throw new Error("Invalid issuer");
		}
	}

	private isGoogleCredentials(creds: unknown): creds is GoogleTokens {
		return (
			typeof creds === "object" &&
			creds !== null &&
			"id_token" in creds &&
			"access_token" in creds
		);
	}
}

// Custom error for handling OAuth redirects
export class AuthRedirectError extends Error {
	constructor(public redirectUrl: string) {
		super("Authentication requires redirect");
		this.name = "AuthRedirectError";
	}
}

// Usage example:
/*
const googleProvider = new GoogleOAuthProvider({
  clientId: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  // Optional configurations
  scopes: ['profile', 'email'],
  accessType: 'offline',
  prompt: 'consent'
});

// Step 1: Initialize sign in (will throw AuthRedirectError)
try {
  await googleProvider.signIn({ 
    redirectUrl: 'https://your-app.com/auth/callback' 
  });
} catch (error) {
  if (error instanceof AuthRedirectError) {
    // Redirect user to Google's consent page
    window.location.href = error.redirectUrl;
  }
}

// Step 2: Handle callback
const result = await googleProvider.signIn({
  code: 'received-auth-code',
  redirectUrl: 'https://your-app.com/auth/callback'
});

// Now you have the user's Google profile and tokens
console.log(result.profile.email);
*/
