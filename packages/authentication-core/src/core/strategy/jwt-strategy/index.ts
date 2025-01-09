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
	AuthResult,
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
	AuthError,
	UnknownAuthError,
} from "../../error";
import { createLogger } from "@pete_keen/logger";

import { safeExecute } from "../../error";

const logger = createLogger({});

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

	async validate(keyCards: KeyCards): Promise<AuthResult> {
		try {
			const validationResult = await this.validateCard(
				keyCards,
				"access"
			);
			if (validationResult.success) {
				logger.info("Keycards validated", {
					userId: validationResult.user.id,
					email: validationResult.user.email,
				});
				return {
					success: true,
					user: validationResult.user,
					keyCards,
				};
			}
			const refreshResult = await this.validateCard(keyCards, "refresh");
			if (refreshResult.success) {
				logger.info("Refresh keycard validated", {
					userId: refreshResult.user.id,
					email: refreshResult.user.email,
				});
				const newKeyCards = await this.createKeyCards(
					refreshResult.user
				);
				return {
					success: true,
					user: refreshResult.user,
					keyCards: newKeyCards,
				};
			}
		} catch (error) {
			return {
				success: false,
				error,
			};
		}
	}

	private async validateCard(
		keyCards: KeyCards,
		name: string
	): Promise<AuthResult> {
		try {
			const card = keyCards.find((keyCard) => keyCard.name === name);
			if (!card) {
				throw new KeyCardMissingError(`${name} Key Card Missing`);
			}
			const result = await this.tokenService.validate(
				card.value,
				this.config[name]
			);
			return {
				success: true,
				user: result.user,
				keyCards,
			};
		} catch (error) {
			if (error instanceof AuthError) {
				logger.warn(`${name} keycard not validated`, {
					error,
				});
				return {
					success: false,
					error,
				};
			} else {
				logger.warn(`${name} keycard not validated - unknown error`, {
					error,
				});
				return {
					success: false,
					error: new UnknownAuthError("Unknown error"),
				};
			}
		}
	}

	supportsRefresh(): boolean {
		// TO-DO decide if this is needed
		return true;
	}
}
