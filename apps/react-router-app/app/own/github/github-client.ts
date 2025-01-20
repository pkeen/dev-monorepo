import crypto from "node:crypto";
import { AbstractOAuthProvider, OAuthProviderConfig } from "../index.types";

type ScopeType = "repo" | "repo_status" | "public_repo" | "repo_deployment";

export class GitHub extends AbstractOAuthProvider<ScopeType> {
	name = "github";
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
	protected minimumScopes = [];

	constructor(config: OAuthProviderConfig<ScopeType>) {
		super(config);
	}

	getScopes(): string {
		return this.transformScopes(this.minimumScopes);
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
		const headers = new Headers();
		headers.append("Accept", "application/json");
		// headers.append("Content-Type", "application/json");
		const data = await fetch(tokenUrl.toString(), {
			method: "POST",
			headers,
		});
		return data.json();
	}
}

// export class GitHubClient {
//     private clientId: string;
//     private clientSecret: string;
//     private redirectUri: string;
//     private authorizeEndpoint = "https://github.com/login/oauth/authorize";
//     private tokenEndpoint = "https://github.com/login/oauth/access_token";
//     private scopes: Scope[] = ["openid", "profile", "email"];
// 	private state = crypto.randomBytes(32).toString("hex"); // This should be a secure random value

//     constructor(clientId: string, clientSecret: string, redirectUri: string) {
//         this.clientId = clientId;
//         this.clientSecret = clientSecret;
//         this.redirectUri = redirectUri;
//     }

// }
