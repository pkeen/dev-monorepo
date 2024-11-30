import { NextResponse } from "next/server";
import { getAuthConfig } from "@/lib/auth/config";

export function nextWithCookie(
	token: string,
	cookieKey: string,
	cookieOptions: {
		httpOnly?: boolean;
		secure?: boolean;
		path?: string;
		maxAge?: number;
	} = {}
): NextResponse {
	const response = NextResponse.next();
	const cookieOptionsWithDefaults = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 3600,
		...cookieOptions,
	};
	cookieKey = cookieKey || `${getAuthConfig().cookies.namePrefix}-token`;

	response.cookies.set(cookieKey, token, cookieOptionsWithDefaults);
	return response;
}
