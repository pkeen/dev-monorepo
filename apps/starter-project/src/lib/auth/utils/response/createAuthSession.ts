// import jwt from "jsonwebtoken";
// import { signToken } from "./jwt";
// import { ResponseWithCookie } from "./ResponseWithCookie";
// import { NextResponse } from "next/server";

// /**
//  * Creates a JWT and sets it as an HTTP-only cookie.
//  * @param payload - The payload to include in the JWT.
//  * @param key - (Optional) The name of the cookie.
//  * @param options - Optional settings for token creation and cookie attributes.
//  */
// export async function createAuthSession(
// 	data: Record<string, any>,
// 	payload: Record<string, any>,
// 	cookieKey: string = "pk-auth-token",
// 	options: {
// 		secret?: string;
// 		expiresIn?: string | number; // JWT expiration time
// 		algorithm?: jwt.Algorithm;
// 		cookieOptions?: {
// 			httpOnly?: boolean;
// 			secure?: boolean;
// 			path?: string;
// 			maxAge?: number | string;
// 		};
// 	} = {}
// ): NextResponse {
// 	// Step 1: Create the JWT
// 	const token = await signToken(payload, {
// 		expiresIn: options.expiresIn,
// 		algorithm: options.algorithm,
// 	});

// 	return ResponseWithCookie(data, token, cookieKey, options.cookieOptions);

// 	// Step 2: Set the cookie and return response
// }
