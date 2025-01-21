// import crypto from "node:crypto";
// import { AbstractOAuthProvider, OAuthProviderConfig } from "../index.types";
import { AbstractOAuthProvider } from "./oauth-provider";
import { OAuthProviderConfig } from "./index.types";

type ScopeType = "repo" | "repo_status" | "public_repo" | "repo_deployment";

export class GitHub extends AbstractOAuthProvider<ScopeType> {
	readonly type = "oauth2";
	readonly key = "github";
	readonly name = "GitHub";

	private apiBaseUrl = "https://api.github.com";

	protected authorizeEndpoint = "https://github.com/login/oauth/authorize";
	protected tokenEndpoint = "https://github.com/login/oauth/access_token";
	// private scopes: string[];
	// protected redirectUri = "http://localhost:5173/auth/redirect/github";
	protected scopeMap = {
		repo: "repo",
		repo_status: "repo:status",
		repo_deployment: "repo_deployment",
		public_repo: "public_repo",
	};
	protected defaultScopes = [];

	constructor(config: OAuthProviderConfig<ScopeType>) {
		super(config);
	}

	getScopes(): string {
		return this.transformScopes(this.defaultScopes);
	}

	async exchangeCodeForTokens(
		authorizationCode: string
	): Promise<Record<string, any>> {
		const tokenUrl = new URL(this.tokenEndpoint);
		tokenUrl.searchParams.set("client_id", this.clientId);
		tokenUrl.searchParams.set("client_secret", this.clientSecret);
		tokenUrl.searchParams.set("redirect_uri", this.redirectUri);
		tokenUrl.searchParams.set("grant_type", "authorization_code");
		tokenUrl.searchParams.set("code", authorizationCode);
		const headers = new Headers();
		headers.append("Accept", "application/json");
		// headers.append("Content-Type", "application/json");
		const data = await fetch(tokenUrl.toString(), {
			method: "POST",
			headers,
		});
		return data.json();
	}

	async handleRedirect(code: string): Promise<Record<string, any>> {
		const tokens = await this.exchangeCodeForTokens(code);
		return await this.getUserProfile(tokens.access_token);
	}

	async getUserProfile(accessToken: string): Promise<GitHubUserProfile> {
		const url = new URL(`${this.apiBaseUrl}/user`);
		const headers = new Headers();
		headers.append("Authorization", `Bearer ${accessToken}`);
		const response = await fetch(url.toString(), {
			headers,
		});
		return await response.json();
	}
}

export type GitHubUserProfile = {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	followers_url: string;
	following_url: string;
	gists_url: string;
	starred_url: string;
	subscriptions_url: string;
	organizations_url: string;
	repos_url: string;
	events_url: string;
	received_events_url: string;
	type: string;
	user_view_type: string;
	site_admin: boolean;
	name: string;
	company: null;
	blog: string;
	location: string;
	email: string;
	hireable: null;
	bio: null;
	twitter_username: null;
	notification_email: string;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
};
