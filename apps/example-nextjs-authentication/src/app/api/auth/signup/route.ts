import { authSystem } from "@/app/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const credentials = await request.json();
		const authState = await authSystem.signup(credentials);
		// store the auth state in the response
		const response = new NextResponse();
		await authSystem.transportAdapter.storeAuthState(response, authState);
		return response;
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "An error occurred";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
