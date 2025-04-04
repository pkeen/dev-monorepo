// lib/session.ts
import { cookies } from "next/headers";
import { serialize, parse } from "cookie";

export const SESSION_COOKIE_NAME = "auth_session_next";

export async function getSession(): Promise<Record<string, any> | null> {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

	if (!sessionCookie) return null;

	// In production, you'd decode/decrypt or parse JWT here
	return JSON.parse(sessionCookie);
}

export function commitSession(session: Record<string, any>) {
	const cookieValue = serialize(
		SESSION_COOKIE_NAME,
		JSON.stringify(session),
		{
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24 * 7, // 1 week
		}
	);

	return cookieValue;
}

export function destroySession() {
	return serialize(SESSION_COOKIE_NAME, "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 0,
	});
}
