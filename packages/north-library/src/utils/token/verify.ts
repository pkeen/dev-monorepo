import { verifyToken } from "./jwt";

/**
 * Verifies a JWT and returns the decoded payload.
 * @param token - The JWT to verify.
 * @returns The decoded payload.
 */

export const verify = async (token: string) => {
	try {
		const result = await verifyToken(token);
		return result.payload;
	} catch (error) {
		console.error("Error verifying token:", error);
		return undefined;
	}
};
