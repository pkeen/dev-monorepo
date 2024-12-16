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
	VerifiedToken,
} from "../../types";
// import { JwtTokenService } from "../../token-service";
import { JwtTokenService } from "../../token-service";
import { AuthValidationResult } from "../../types";
import { expiresInToSeconds } from "../../utils";
import {
	ExpiredKeyCardError,
	InvalidKeyCardError,
	KeyCardCreationError,
	KeyCardMissingError,
} from "../../error";

export class JwtStrategy implements AuthStrategy {
	private tokenService: TokenService;
	constructor(private config: JwtConfig) {
		this.config = config;
		this.tokenService = new JwtTokenService();
	}

	async createKeyCards(user: User): Promise<KeyCards> {
		try {
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
		} catch (error) {
			throw new KeyCardCreationError("Key Card Creation Failed");
		}
	}

	async logout(keyCards: KeyCards): Promise<void> {
		return Promise.resolve();
	}

	async validate(keyCards: KeyCards): Promise<AuthValidationResult> {
		try {
			const accessKeyCard = keyCards.find(
				(keyCard) => keyCard.name === "access"
			);
			if (!accessKeyCard) {
				throw new KeyCardMissingError("Access Key Card Missing");
			}
			const result = await this.tokenService.validate(
				accessKeyCard.value,
				this.config.access
			);
			return {
				valid: true,
				user: result.user,
			};
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				throw new ExpiredKeyCardError(
					"Key Card Expired " + error.message
				);
			} else if (error.name === "TokenTamperedError") {
				throw new InvalidKeyCardError(
					"Key Card Invalid " + error.message
				);
			}
			throw error;
		}
	}

	async validateAll(keyCards: KeyCards): Promise<AuthValidationResult> {
		try {
			// 1. Make sure they are present
			const accessKeyCard = keyCards.find(
				(keyCard) => keyCard.name === "access"
			);
			if (!accessKeyCard) {
				throw new KeyCardMissingError("Access Key Card Missing");
			}
			const refreshKeyCard = keyCards.find(
				(keyCard) => keyCard.name === "refresh"
			);
			if (!refreshKeyCard) {
				throw new KeyCardMissingError("Refresh Key Card Missing");
			}
			// 2. Verify the tokens
			const resultAccess = await this.tokenService.validate(
				accessKeyCard.value,
				this.config.access
			);
			const resultRefresh = await this.tokenService.validate(
				refreshKeyCard.value,
				this.config.refresh
			);

			return {
				valid: true,
				user: resultAccess.user,
			};
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				throw new ExpiredKeyCardError(
					"Key Card Expired " + error.message
				);
			} else if (error.name === "TokenTamperedError") {
				throw new InvalidKeyCardError(
					"Key Card Invalid " + error.message
				);
			}
			throw error;
		}
	}

	supportsRefresh(): boolean {
		return true;
	}

	async validateRefresh(keyCards: KeyCards): Promise<AuthValidationResult> {
		try {
			const refreshKeyCard = keyCards.find(
				(keyCard) => keyCard.name === "refresh"
			);
			if (!refreshKeyCard)
				throw new KeyCardMissingError("Refresh Key Card Missing");

			const result = await this.tokenService.validate(
				refreshKeyCard.value,
				this.config.refresh
			);
			return {
				valid: true,
				user: result.user,
			};
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				throw new ExpiredKeyCardError(
					"Key Card Expired " + error.message
				);
			} else if (error.name === "TokenTamperedError") {
				throw new InvalidKeyCardError(
					"Key Card Invalid " + error.message
				);
			}
			throw error;
		}
	}
}
