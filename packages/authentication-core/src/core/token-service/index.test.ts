import { jest, describe, it, expect } from "@jest/globals";
import { JwtTokenService } from "./index";
import {
	TokenTamperedError,
	AuthError,
	TokenError,
	AuthErrorCode,
} from "../error";
import { User, JwtOptions } from "../types";

describe("JwtTokenService", () => {
	let tokenService: JwtTokenService;
	const options: JwtOptions = {
		secretKey: "your-secret-key",
		algorithm: "HS256",
		expiresIn: "1h",
	};
	const mockUser: User = {
		id: "123",
		email: "test@example.com",
	};

	beforeEach(() => {
		tokenService = new JwtTokenService();
	});

	it("should convert user to payload", () => {
		const payload = tokenService.createPayload(mockUser);
		expect(payload.id).toStrictEqual(mockUser.id);
		expect(payload.email).toStrictEqual(mockUser.email);
	});

	it("should generate a JWT token", async () => {
		const token = await tokenService.generate(mockUser, options);
		expect(token).toBeDefined();
	});

	it("validates legitimate token", async () => {
		// Generate a valid token first
		const token = await tokenService.generate(mockUser, options);
		const result = await tokenService.validate(token, options);
		expect(result.user).toStrictEqual(mockUser);
	});

	it("throws TokenTamperedError for modified payload", async () => {
		const token = await tokenService.generate(mockUser, options);
		const [header, payload, signature] = token.split(".");
		const tamperedPayload = Buffer.from(
			JSON.stringify({ ...JSON.parse(atob(payload)), id: "hacked" })
		).toString("base64url");
		const tamperedToken = `${header}.${tamperedPayload}.${signature}`;

		await expect(
			tokenService.validate(tamperedToken, options)
		).rejects.toThrow(TokenTamperedError);
	});

	it("throws TokenExpiredError for expired token", async () => {
		const token = await tokenService.generate(mockUser, {
			...options,
			expiresIn: "0s",
		});
		try {
			await tokenService.validate(token, options);
		} catch (error) {
			expect(error).toBeInstanceOf(TokenError);
			expect(error.code).toBe(AuthErrorCode.TOKEN_EXPIRED);
		}
	});

	// it("throws InvalidSignatureError for invalid signature", async () => {
	// 	const token = await tokenService.generate(mockUser, options);
	// 	const [header, payload, signature] = token.split(".");
	// 	const tamperedSignature = "invalid-signature";
	// 	const tamperedToken = `${header}.${payload}.${tamperedSignature}`;

	// 	await expect(
	// 		tokenService.validate(tamperedToken, options)
	// 	).rejects.toThrow(InvalidSignatureError);
	// });
});
