import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import { secret } from "./key";
import { JWTVerifyResult } from "jose";

/**
 * Verifies a JWT and returns the decoded payload.
 * @param token - The JWT to verify.
 * @param options - Optional settings like algorithms to accept.
 * @returns The decoded payload.
 */
export const verifyToken = async (
	token: string,
	options: { algorithms?: jwt.Algorithm[] } = {}
): Promise<JWTVerifyResult> => {
	const payload = await jwtVerify(token, secret, options);
	return payload;
};
