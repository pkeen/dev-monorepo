import { authSystem, sessionStateStorage } from "@/app/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const response = new NextResponse();
	const keyCards = await sessionStateStorage.retrieve(request);
	await authSystem.logout({
		keyCards,
	});

	await sessionStateStorage.clear(response);

	return response;
}
