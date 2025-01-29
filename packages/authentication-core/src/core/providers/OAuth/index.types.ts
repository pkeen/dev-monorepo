import crypto from "crypto";



export interface IOAuthProvider {
	createAuthorizationUrl(): string;
	exchangeCodeForTokens(
		authorizationCode: string
	): Promise<Record<string, any>>;
	handleRedirect(code: string): Promise<Record<string, any>>;
	getState(): string;
	getScopes(): string;
}

// Define a generic Token interface
// TODO: How do we deal with this with different scopes and providers
// Each provider implementation will need to map this to the main token interface for the application
export interface Token {
	accessToken: string;
	refreshToken?: string;
	expiresIn: number;
	// Add other token properties as needed
}
