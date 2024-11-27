import { verifyToken } from "./jwt/verifyToken";
import { signToken } from "./jwt/signToken";
import { sign } from "@/lib/auth/utils/token";
// import { verify } from "./verify";

/**
 * Verifies a JWT and refreshes it if not expired.
 * @param token - The JWT to verify.
 * @returns The refreshed JWT token.
 */

export const verifyAndRefresh = async (token: string): Promise<string> => {
	const { payload } = await verifyToken(token);
	// const payload = await verify(token);

	console.log(payload);
	// if (payload.exp * 1000 < Date.now()) {
	//     const newToken = await signToken(payload);
	//     return newToken;
	// }
	token = await sign("access", payload);

	return token;
};
