export * from "./credentials/index.types";
// export * from "./email/index.types";
// export * from "./oidc/index.types";

export type ProviderType = "oidc" | "oauth" | "email" | "credentials";
// | WebAuthnProviderType;

export interface CommonProviderOptions {
	/**
	 * Uniquely identifies the provider in {@link AuthConfig.providers}
	 * It's also part of the URL
	 */
	id: string;
	/**
	 * The provider name used on the default sign-in page's sign-in button.
	 * For example if it's "Google", the corresponding button will say:
	 * "Sign in with Google"
	 */
	name: string;
	/** See {@link ProviderType} */
	type: ProviderType;
}

export interface OAuthProviderOptions extends CommonProviderOptions {
	/** The URL to the provider's sign-in page */
	signinUrl: string;
	/** The URL to the provider's sign-out page */
	signoutUrl: string;
}

export type CredentialsProviderOptions = CommonProviderOptions & {
	id: "credentials";
	name: "credentials";
	type: "credentials";
	signinCredentials: {
		email: string;
		password: string;
	};
	signupCredentials: {
		email: string;
		password: string;
		name?: string;
	};
};

export type ProviderOptions = OAuthProviderOptions | CredentialsProviderOptions;
