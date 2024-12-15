import {
	AuthStrategy,
	JwtConfig,
	Credentials,
	AuthTokens,
	KeyCards,
	KeyCard,
	User,
	AuthState,
	TokenService,
} from "../../types";
import { JwtTokenService } from "../../token-service";
import { AuthValidationResult } from "../../types";
import { expiresInToSeconds } from "../../utils";

export class JwtStrategy implements AuthStrategy {
	private tokenService: TokenService;
	constructor(private config: JwtConfig) {
		this.config = config;
		this.tokenService = new JwtTokenService();
	}

	async createKeyCards(user: User): Promise<KeyCards> {
		const keyCards: KeyCards = [];
		const accessToken = await this.tokenService.generate(
			user,
			this.config.access
		);
		const refreshToken = await this.tokenService.generate(
			user,
			this.config.refresh
		);
		const accessKeyCard: KeyCard = {
			name: this.config.access.key,
			value: accessToken,
			type: "access",
			storageOptions: {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				path: "/",
				maxAge: expiresInToSeconds(this.config.access.expiresIn),
				sameSite: "lax",
			},
		};
		const refreshKeyCard: KeyCard = {
			name: this.config.refresh.key,
			value: refreshToken,
			type: "refresh",
			storageOptions: {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				path: "/",
				maxAge: expiresInToSeconds(this.config.refresh.expiresIn),
				sameSite: "lax",
			},
		};
		keyCards.push(accessKeyCard);
		keyCards.push(refreshKeyCard);
		return keyCards;
	}

	async logout(keyCards: KeyCards): Promise<void> {
		return Promise.resolve();
	}

	// async validate(keyCard: KeyCard): Promise<AuthValidationResult> {
	//     return await this.tokenService.verify(
	//         keyCard.value,
	//     );
	// }

	async validateAll(keyCards: KeyCards): Promise<AuthValidationResult> {
		// 1. Make sure they are present
		const accessKeyCard = keyCards.find(
			(keyCard) => keyCard.name === "access"
		);
		const refreshKeyCard = keyCards.find(
			(keyCard) => keyCard.name === "refresh"
		);

		// 1a if no access or refresh token, return error
		if (!accessKeyCard || !refreshKeyCard) {
			return Promise.resolve({
				valid: false,
				user: null,
			});
		}

		// 2. Verify the access token
		const resultAccess = await this.tokenService.verify(
			accessKeyCard.value,
			this.config.access
		);
		const resultRefresh = await this.tokenService.verify(
			refreshKeyCard.value,
			this.config.refresh
		);

		// return if not valid
		if (!resultAccess.valid || !resultRefresh.valid) {
			return Promise.resolve({
				valid: false,
				user: null,
			});
		}

		const user = resultAccess.user as User;
		return {
			valid: true,
			user,
		};
	}

	supportsRefresh(): boolean {
		return true;
	}

	async validateRefresh(keyCards: KeyCards): Promise<AuthValidationResult> {
		// verify the refresh token
		const refreshKeyCard = keyCards.find(
			(keyCard) => keyCard.name === "refresh"
		);

		// 1a if no refresh token, return error
		if (!refreshKeyCard) {
			return {
				valid: false,
			};
		}

		//1 verify refresh token
		return await this.tokenService.verify(
			refreshKeyCard.value,
			this.config.refresh
		);

		// 3. query the database for the user
		// woah this doesnt work this strategy doesnt have access to it

		// // 1. Verify the refresh token
		// // 1a if no refresh token, return error
		// if (!keyCards) {
		// 	return {};
		// }

		// //1b verify refresh token
		// const validationResult = await this.tokenService.verify(
		// 	authState.refreshToken,
		// 	this.config.refresh
		// );
		// console.log("validationResult (in strategy):", validationResult);

		// if (!validationResult.valid) {
		// 	return {};
		// }

		// // 3. query the database for the user
		// // woah this doesnt work this strategy doesnt have access to it

		// // 2. Generate a new access token
		// const user = validationResult.user as User;
		// const newAuthState = await this.createAuthState(user);
		// return newAuthState;
	}

	async signup(credentials: Credentials): Promise<AuthState> {
		// TODO

		throw new Error("not supported");
	}

	// async createAuthTokens(user: User): Promise<AuthTokens> {
	// 	const accessToken = await this.tokenService.generate(
	// 		user,
	// 		this.config.access
	// 	);
	// 	const refreshToken = await this.tokenService.generate(
	// 		user,
	// 		this.config.refresh
	// 	);
	// 	const authTokens: AuthTokens = {
	// 		accessToken: {
	// 			value: accessToken,
	// 		},
	// 		refreshToken: {
	// 			value: refreshToken,
	// 		},
	// 	};
	// 	return authTokens;
	// }
}

// export const JwtStrategy: (tokenService: TokenService): AuthStrategy  => {

// }
