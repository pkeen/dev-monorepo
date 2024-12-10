import { NextRequest, NextResponse } from "next/server";
import { AuthResponse } from "@utils";
import type { AuthConfig } from "../types/config";
import { token } from "@utils";

// import { AuthResponse, AuthConfig, utils } from "@main";
// check refresh token
// returns new access token

export async function POST(request: NextRequest, authConfig: AuthConfig) {
	try {
		// Step 1: csrf protection
		// Step 1a: Get CSRF token
		const clientCsrf = request.headers.get("csrf-token");
		console.log("Client Csrf:", clientCsrf);
		const serverCsrf = request.cookies.get(
			`${authConfig.cookies.namePrefix}-csrf`
		)?.value;
		console.log("Server Csrf:", serverCsrf);

		// Step 1b: Verify CSRF token
		if (!clientCsrf || clientCsrf !== serverCsrf) {
			throw new Error("Invalid CSRF token");
		}
		// Step 2: Get Refresh token
		const refreshToken = request.cookies.get(
			`${authConfig.cookies.namePrefix}-token`
		)?.value;

		if (!refreshToken) {
			throw new Error("Refresh token is missing");
		}

		// Step 3: Verify Refresh Token
		const payload = await token.verify(refreshToken);
		console.log(payload);
		if (!payload) {
			throw new Error("Payload is missing");
		}

		// Step 4: Refresh Access Token
		// 4a. Create the format for the new access token
		// create a payload creator function that takes in either an old payload or a user object from db
		const newPayload = { id: payload.id, email: payload.email };
		// 4b Create the new access token
		const accessToken = await token.sign("access", newPayload);

		// Step 4: Create new refresh token
		const newRefreshToken = await token.sign("refresh", newPayload);

		// Step 6: Create an AuthResponse with a access token and refresh token in cookie
		const res = AuthResponse.withJson(
			{ message: "Refresh token is valid", accessToken }, // add csrf to the response
			{ status: 200 }
		);
		res.setAccess(accessToken);
		res.setRefresh(newRefreshToken);
		return res;
	} catch (error) {
		// console.log(error);
		const errorMessage =
			error instanceof Error ? error.message : "Refresh token is invalid";
		return NextResponse.json({ message: errorMessage }, { status: 401 });
	}
}
