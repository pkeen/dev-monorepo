import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { getSession } from "../session.server";
import authSystem from "../auth";
import type { UserProfile } from "@pete_keen/authentication-core";

export const useAuth = async ({
	request,
}: LoaderFunctionArgs): Promise<UserProfile | null> => {
	// TODO: Check if user is authenticated
	const session = await getSession(request.headers.get("Cookie"));
	const sessionState = session.get("authState");
	console.log("sessionState: ", sessionState);
	if (!sessionState || !sessionState.authenticated) {
		return null;
	}
	const authState = await authSystem.validate(sessionState.keyCards);
	return authState.user;
};

export const requireAuth = async (
	request: Request,
	redirectTo?: string
): Promise<UserProfile | null> => {
	const session = await getSession(request.headers.get("Cookie"));
	const sessionState = session.get("authState");
	console.log("sessionState: ", sessionState);
	if (!sessionState) {
		if (redirectTo) {
			throw redirect(redirectTo);
		}
		return null;
	}
	const authState = await authSystem.validate(sessionState.keyCards!);
	if (!authState.authenticated) {
		if (redirectTo) {
			throw redirect(redirectTo);
		}
		return null;
	}
	return authState.user;
};
