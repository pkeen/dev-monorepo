// import { AuthenticationService } from "@pete_keen/auth-core";
import { NextResponse } from "next/server";

import { authSystem } from "@/app/auth";
import { NextAppTransportAdapter } from "@pete_keen/authentication-core/transporters";

export async function POST(request: Request) {
	const credentials = await request.json();

	const authResult = await authSystem.authenticate(credentials);
	console.log("authResult:", authResult);

	if (authResult.success && authResult.authState) {
		const transportAdapter = new NextAppTransportAdapter();
		const res = NextResponse.next();
		await transportAdapter.storeAuthState(res, authResult.authState);
		return NextResponse.json({
			success: true,
			message: "Sign in successful",
		});
	}

	console.log("authResult:", authResult);
	return new Response(JSON.stringify(authResult));
}
