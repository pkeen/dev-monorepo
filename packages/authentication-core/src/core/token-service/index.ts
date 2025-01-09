import {
	AuthValidationResult,
	JwtConfig,
	JwtOptions,
	User,
	TokenService,
	VerifiedToken,
} from "../types";
import {
	AuthError,
	AuthErrorCode,
	TokenTamperedError,
	TokenError,
	TokenExpiredError,
} from "../error";
// import jose from "jose";
import { SignJWT, JWTPayload, jwtVerify } from "jose";
import { createLogger } from "@pete_keen/logger";

const logger = createLogger({});

// Custom payload type that extends JWTPayload
interface AuthPayload extends JWTPayload {
	id: string; // User ID
	email: string; // User email
}

export class JwtTokenService implements TokenService {
	createPayload(user: User): AuthPayload {
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

	// async revoke(token: string): Promise<void> {
	// 	return Promise.resolve();
	// }

	async validate(token: string, options: JwtOptions): Promise<VerifiedToken> {
		try {
			const { payload, protectedHeader } = await jwtVerify(
				token,
				new TextEncoder().encode(options.secretKey)
				// {
				// 	// Optional: Specify required claims
				// 	requiredClaims: ["id", "email"],
				// 	// // Optional: Validate issuer
				// 	// issuer: options.issuer,
				// 	// // Optional: Validate audience
				// 	// audience: options.audience,
				// }
			);

			// // Verify required claims exist and are valid
			// if (!payload.id || !payload.email) {
			// 	throw new TokenTamperedError("Missing required claims");
			// }

			// // Additional custom claim validation if needed
			// if (payload.aud && payload.aud !== options.audience) {
			// 	throw new TokenTamperedError("Invalid audience");
			// }

			const user: User = {
				id: payload.id as string,
				email: payload.email as string,
			};

			return {
				user: user,
				expiresAt: payload.exp as number,
				// roles: payload.roles as string[] | undefined,
				// scope: payload.scope as string[] | undefined,
			};
		} catch (error: any) {
			// Token expiration is an expected error - don't throw
			if (error.code === "ERR_JWT_EXPIRED") {
				throw new TokenExpiredError(
					"Token has expired " + (error.message || "Invalid token")
				);
			}
			logger.warn(
				"Token validation failed: " + (error.message || "Invalid token")
			);

			// All other JWT errors indicate tampering - throw security error
			if (
				error.code.startsWith("ERR_JWT_") ||
				error.code.startsWith("ERR_JWS_")
			) {
				throw new TokenTamperedError(
					"Token validation failed: " +
						(error.message || "Invalid token")
				);
			}

			// Re-throw unexpected errors
			throw error;
		}
	}

	// async verify(token: string, options: JwtOptions): Promise<User> {
	// 	try {
	// 		const { payload, protectedHeader } = await jwtVerify(
	// 			token,
	// 			new TextEncoder().encode(options.secretKey)
	// 		);

	// 		// At this point, if jwtVerify didn't throw, we have a valid payload.
	// 		// Assume `payload` is castable to `User` or that you have logic to build a `User` object from payload.
	// 		const user = payload as unknown as User; // Adjust based on your payload structure.
	// 		console.log("user (in verify): ", user);
	// 		return user;
	// 	} catch (error: any) {
	// 		// jwtVerify can throw various errors depending on why validation failed:
	// 		// e.g., TokenExpiredError, JWTClaimValidationFailed, etc.

	// 		let reason = "Unknown error";
	// 		let code = "unknown_error";

	// 		if (
	// 			error.name === "JWTExpired" ||
	// 			error.code === "ERR_JWT_EXPIRED"
	// 		) {
	// 			reason = "Token has expired";
	// 			code = "expired_token";
	// 		} else if (
	// 			error.name === "JWSInvalid" ||
	// 			error.code === "ERR_JWS_INVALID"
	// 		) {
	// 			reason = "Invalid token signature";
	// 			code = "invalid_signature";
	// 		} else if (
	// 			error.name === "JWTClaimValidationFailed" ||
	// 			error.code === "ERR_JWT_CLAIM_INVALID"
	// 		) {
	// 			reason = "Invalid token claims";
	// 			code = "invalid_claims";
	// 		}

	// 		throw
	// 	}
	// }
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
