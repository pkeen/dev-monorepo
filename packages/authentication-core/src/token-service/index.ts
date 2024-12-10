import { JwtConfig, User } from "../core/types";
// import jose from "jose";
import { SignJWT } from "jose";
import { AuthState } from "../core/types";

// Core token service interface
interface TokenService {
	generate: (user: User, options: JwtConfig) => Promise<AuthState>;
	// verify: (token: string) => Promise<User | null>;
	revoke: (token: string) => Promise<void>;
	// refresh: (refreshToken: string) => Promise<TokenResponse>;
}

export class JwtTokenService implements TokenService {
	// private accessTokenSecret: Uint8Array;
	// private refreshTokenSecret: Uint8Array;

	// constructor(private options: JWTOptions) {
	// 	// this.accessTokenSecret = new TextEncoder().encode(
	// 	// 	options.access.secretKey
	// 	// );
	// 	// this.refreshTokenSecret = new TextEncoder().encode(
	// 	// 	options.refresh.secretKey
	// 	// );
	// 	// this.options = options;
	// }

	async generate(user: User, config: JwtConfig): Promise<AuthState> {
		const authState: AuthState = {};

		const buildPayload = (fields?: string[]): Record<string, unknown> => {
			const payload: Record<string, unknown> = {
				sub: user.id.toString(),
			};
			if (fields) {
				for (const field of fields) {
					if (field in user) {
						payload[field] = user[field];
					}
				}
			}
			return payload;
		};

		const createToken = async (
			payload: Record<string, unknown>,
			tokenConfig: {
				secretKey: string;
				algorithm: string;
				expiresIn: string;
			}
		): Promise<string> => {
			return new SignJWT(payload)
				.setProtectedHeader({ alg: tokenConfig.algorithm || "HS256" })
				.setIssuedAt()
				.setExpirationTime(tokenConfig.expiresIn || "1h")
				.sign(new TextEncoder().encode(tokenConfig.secretKey));
		};

		const accessPayload = buildPayload(config.access.fields);
		const refreshPayload = buildPayload(config.refresh.fields);

		const [accessToken, refreshToken] = await Promise.all([
			createToken(accessPayload, config.access),
			createToken(refreshPayload, config.refresh),
		]);

		authState.accessToken = accessToken;
		authState.refreshToken = refreshToken;

		return authState;
	}

	async revoke(token: string): Promise<void> {
		return Promise.resolve();
	}
}

// export const createJwtTokenService = (options: TokenOptions): TokenService => {
// 	const accessTokenSecret = new TextEncoder().encode(
// 		options.accessTokenSecret
// 	);

// 	return {
// 		generate: async (user: User) => {
// 			const payload = {
// 				sub: user.id,
// 				// tenantId: options?.tenantId,
// 				// roles: user.roles,
// 				// role: user.role,
// 				scope: options?.scope,
// 				aud: options?.audience,
// 				// iat: Math.floor(Date.now() / 1000),
// 				// exp: Math.floor(Date.now() / 1000) + options?.expiresIn,
// 			};

// 			const jwt = await new SignJWT(payload)
// 				.setIssuedAt()
// 				.setExpirationTime(options?.expiresIn || "1h")
// 				.setProtectedHeader({ alg: options?.algorithm || "HS256" })
// 				.sign(accessTokenSecret);

// 			return jwt;

// 			// const accessToken = jwt.sign(payload, options.accessTokenSecret);
// 			// const response: TokenResponse = {
// 			//     accessToken: jwt,
// 			//     expiresIn: payload.exp - payload.iat,
// 			//     tokenType: "Bearer",
// 			// };
// 			// if (options?.includeRefreshToken) {
// 			//     response.refreshToken = await this.generateRefreshToken(user.id);
// 			// }
// 			// return response;
// 		},
// 	};
// };
