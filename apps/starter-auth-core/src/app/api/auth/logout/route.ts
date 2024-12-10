import { authSystem } from "@/app/auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const response = new NextResponse();
	await authSystem.logout(request, response);
	return response;
}
