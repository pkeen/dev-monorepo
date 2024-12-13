import { AuthStrategy, JwtConfig, Credentials, AuthTokens } from "../../types";
import { TokenService } from "../../types";
import { User, AuthState } from "../../types";
import { JwtTokenService } from "../../../token-service";
import { AuthValidationResult } from "../../types";

export class JwtStrategy implements AuthStrategy {
	private tokenService: TokenService;
	constructor(private config: JwtConfig) {
		this.config = config;
		this.tokenService = new JwtTokenService();
	}

	async createAuthState(
		user: User
		// roles: string[]
	): Promise<AuthState> {
		const accessToken = await this.tokenService.generate(
			user,
			this.config.access
		);
		const refreshToken = await this.tokenService.generate(
			user,
			this.config.refresh
		);
		const authState = {
			accessToken,
			refreshToken,
		};
		return authState;
	}

	async createAuthTokens(user: User): Promise<AuthTokens> {
		const accessToken = await this.tokenService.generate(
			user,
			this.config.access
		);
		const refreshToken = await this.tokenService.generate(
			user,
			this.config.refresh
		);
		const authTokens: AuthTokens = {
			accessToken: {
				value: accessToken,
			},
			refreshToken: {
				value: refreshToken,
			},
		};
		return authTokens;
	}

	logout(tokenOrSessionId: string): Promise<void> {
		return Promise.resolve();
	}

	async validate(authState: AuthState): Promise<AuthValidationResult> {
		// 1. Verify Access Token
		// 1a if no access token, return error
		if (!authState.accessToken) {
			return {
				valid: false,
				reason: "Access token is missing",
			};
		}
		//1b verify access token
		const validationResult = await this.tokenService.verify(
			authState.accessToken,
			this.config.access
		);

		console.log("validationResult (in strategy):", validationResult);

		return Promise.resolve(validationResult);
	}

	supportsRefresh(): boolean {
		return true;
	}

	async refresh(authState: AuthState): Promise<AuthState> {
		// 1. Verify the refresh token
		// 1a if no refresh token, return error
		if (!authState.refreshToken) {
			return {};
		}

		//1b verify refresh token
		const validationResult = await this.tokenService.verify(
			authState.refreshToken,
			this.config.refresh
		);
		console.log("validationResult (in strategy):", validationResult);

		if (!validationResult.valid) {
			return {};
		}

		// 3. query the database for the user
		// woah this doesnt work this strategy doesnt have access to it

		// 2. Generate a new access token
		const user = validationResult.user as User;
		const newAuthState = await this.createAuthState(user);
		return newAuthState;
	}

	async signup(credentials: Credentials): Promise<AuthState> {
		// TODO

		throw new Error("not supported");
	}
}

// export const JwtStrategy: (tokenService: TokenService): AuthStrategy  => {

// }
