import { authSystem, sessionStateStorage } from "@/app/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const response = new NextResponse();
	const tokens = await sessionStateStorage.retrieveAuthState(request);
	await authSystem.logout({
		isLoggedIn: true,
		tokens,
	});

	await sessionStateStorage.clearAuthState(response);

	return response;
}
