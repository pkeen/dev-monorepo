import { AuthValidationResult, JwtConfig, JwtOptions, User } from "../types";
// import jose from "jose";
import { SignJWT } from "jose";
import { jwtVerify } from "jose";
import { AuthState } from "../types";
import { JWTVerifyResult } from "jose";
import { JWTPayload } from "jose";
import { TokenService } from "../types";

// Custom payload type that extends JWTPayload
interface AuthPayload extends JWTPayload {
	id: string; // User ID
	email: string; // User email
}

export class JwtTokenService implements TokenService {
	private createPayload(user: User): AuthPayload {
		return {
			id: user.id.toString(),
			email: user.email,
		};
	}

	async generate(user: User, options: JwtOptions): Promise<string> {
		return new SignJWT(this.createPayload(user))
			.setProtectedHeader({ alg: options.algorithm || "HS256" })
			.setIssuedAt()
			.setExpirationTime(options.expiresIn || "1h")
			.sign(new TextEncoder().encode(options.secretKey));
	}

	async revoke(token: string): Promise<void> {
		return Promise.resolve();
	}

	async verify(
		token: string,
		options: JwtOptions
	): Promise<AuthValidationResult> {
		try {
			const { payload, protectedHeader } = await jwtVerify(
				token,
				new TextEncoder().encode(options.secretKey)
			);

			// At this point, if jwtVerify didn't throw, we have a valid payload.
			// Assume `payload` is castable to `User` or that you have logic to build a `User` object from payload.
			const user = payload as unknown as User; // Adjust based on your payload structure.
			return {
				valid: true,
				user,
			};
		} catch (error: any) {
			// jwtVerify can throw various errors depending on why validation failed:
			// e.g., TokenExpiredError, JWTClaimValidationFailed, etc.

			let reason = "Unknown error";
			let code = "unknown_error";

			if (
				error.name === "JWTExpired" ||
				error.code === "ERR_JWT_EXPIRED"
			) {
				reason = "Token has expired";
				code = "expired_token";
			} else if (
				error.name === "JWSInvalid" ||
				error.code === "ERR_JWS_INVALID"
			) {
				reason = "Invalid token signature";
				code = "invalid_signature";
			} else if (
				error.name === "JWTClaimValidationFailed" ||
				error.code === "ERR_JWT_CLAIM_INVALID"
			) {
				reason = "Invalid token claims";
				code = "invalid_claims";
			}

			return {
				valid: false,
				reason,
				code,
			};
		}
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
