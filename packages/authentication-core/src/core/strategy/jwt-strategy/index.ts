import { AuthStrategy, JwtConfig } from "../../types";
import { TokenService } from "../../types";
import { User, AuthState } from "../../types";
import { JwtTokenService } from "../../../token-service";

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
		console.log("config", this.config);
		const authState = await this.tokenService.generate(user, this.config);
		return authState;
	}
	logout(tokenOrSessionId: string): Promise<void> {
		return Promise.resolve();
	}
	validate(tokenOrSessionId: string): Promise<User | null> {
		throw new Error("Method not implemented.");
	}
}

// export const JwtStrategy: (tokenService: TokenService): AuthStrategy  => {

// }
