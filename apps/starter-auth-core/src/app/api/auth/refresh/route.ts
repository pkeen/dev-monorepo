import { authSystem } from "@/app/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	// 1: Get the refresh token
	const authState = await authSystem.transportAdapter.retrieveAuthState(
		request
	);
	// if no refresh token, return 401
	const refreshToken = authState?.refreshToken;
	if (!refreshToken) {
		return NextResponse.json(
			{ message: "Refresh token is missing" },
			{ status: 401 }
		);
	}

	// 2. Verify the refresh token
	// if expired, return 401
	const newAuthState = await authSystem.refresh(authState);
	// this is just the access token currently

	if (!newAuthState) {
		return NextResponse.json(
			{ message: "Refresh token is invalid" },
			{ status: 401 }
		);
	}

	await authSystem.transportAdapter.storeAuthState(request, newAuthState);

	// 3. Get the new access token
	// const response = new NextResponse();
	// await authSystem.refreshToken(request, response);
	// return response;

	// return a basic response for now
	return NextResponse.json({ message: "Hello World" }, { status: 200 });
}
