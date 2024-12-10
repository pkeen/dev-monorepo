// function to sign an access token
import { signToken } from "./jwt";
// import type { AuthConfig } from "../../types/config";
import type { JWTOptions } from "../../types/config";

/**
 * Sign a new access token
 *
 * @remarks
 * This function is used to sign a new access token
 *
 * @param type - The type of token to sign
 * @param payload - The JWT payload data
 * @returns The signed access token
 *
 */

type TokenType = "access" | "refresh"; // Define the type of token to sign

export const sign = (
	jwtOptions: JWTOptions,
	type: TokenType,
	payload: Record<string, unknown>
): Promise<string> => {
	// const config = getAuthConfig();
	const options = type === "access" ? jwtOptions.access : jwtOptions.refresh;
	return signToken(payload, {
		expiresIn: options.expiresIn,
		algorithm: options.algorithm,
	});
};
