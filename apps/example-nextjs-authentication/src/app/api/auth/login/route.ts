// import { AuthenticationService } from "@pete_keen/auth-core";
import { NextResponse } from "next/server";
import { ImprovedAuthState } from "@pete_keen/authentication-core";

import { authSystem } from "@/app/auth";

export async function POST(request: Request) {
	const credentials = await request.json();

	console.log("credentials: ", credentials);

	const authState = await authSystem.authenticate(credentials);

	// if (authState.isLoggedIn && authState.tokens) {
	// 	const res = NextResponse.next();

	// 	return NextResponse.json({
	// 		success: true,
	// 		message: "Sign in successful",
	// 		keyCards: authState.keyCards,
	// 	});
	// }

	return new Response(JSON.stringify(authState));
}
