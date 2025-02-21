import {
	AuthStrategy,
	UserPublic as User,
	AuthState,
	KeyCards,
	KeyCard,
	AuthResult,
	// JwtConfig,
	// Credentials,
	// AuthTokens,
	// KeyCards,
	// KeyCard,
	// User,
	// AuthState,
	// TokenService,
	// VerifiedToken,
	// AuthResult,
} from "../../types";
import { JwtConfig } from "./index.types";
// import { User } from "../../../auth-system/index.types";
// import { JwtTokenService } from "../../token-service";
import { JwtTokenService, TokenService } from "./token-service";
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
				name: this.config.access.name,
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
				name: this.config.refresh.name,
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

	async logout(keyCards: KeyCards): Promise<AuthState> {
		return Promise.resolve({
			authenticated: false,
			user: null,
			keyCards: null,
			error: null,
		});
	}

	async validate(keyCards: KeyCards): Promise<AuthResult> {
		try {
			// console.log("keyCards: ", keyCards);
			const accessState = await this.validateCard(keyCards, "access");
			if (accessState.authenticated) {
				logger.info("Keycards validated", {
					userId: accessState.user.id,
					email: accessState.user.email,
				});
				return {
					type: "success",
					authState: accessState,
				};
			}
			const refreshState = await this.validateCard(keyCards, "refresh");
			if (refreshState.authenticated) {
				logger.info("Refresh keycard validated", {
					userId: refreshState.user.id,
					email: refreshState.user.email,
				});
				// TO-DO - Add DB check here, dont just refresh the cards
				const newKeyCards = await this.createKeyCards(
					refreshState.user
				);
				return {
					type: "refresh",
					authState: {
						...refreshState,
						keyCards: newKeyCards,
					},
				};
			}
		} catch (error) {
			return {
				type: "error",
				error,
			};
		}
	}

	private async validateCard(
		keyCards: KeyCards,
		name: string
	): Promise<AuthState> {
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
				authenticated: true,
				user: result.user,
				keyCards,
			};
		} catch (error) {
			if (error instanceof AuthError) {
				logger.warn(`${name} keycard not validated`, {
					error,
				});
				return {
					authenticated: false,
					error,
					user: null,
					keyCards: null,
				};
			} else {
				logger.warn(`${name} keycard not validated - unknown error`, {
					error,
				});
				return {
					authenticated: false,
					user: null,
					keyCards: null,
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
