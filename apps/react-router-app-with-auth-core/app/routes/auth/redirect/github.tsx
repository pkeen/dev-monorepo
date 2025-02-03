import {
	stateCookie,
	codeVerifierCookie,
	commitSession,
	getSession,
} from "~/session.server";
// import { GitHub } from "@pete_keen/authentication-core/providers";
import authSystem from "~/auth";
// import * as oslo from "oslo/oauth2";
import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	// Retrieve the stored state and codeVerifier from cookies
	const cookieHeader = request.headers.get("Cookie");
	const storedState = await stateCookie.parse(cookieHeader);
	console.log("STORED STATE:", storedState);
	// const codeVerifier = await codeVerifierCookie.parse(cookieHeader);
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const returnedState = url.searchParams.get("state");
	console.log("RETURNED URL:", url);

	const session = await getSession(request.headers.get("Cookie"));
	const headers = new Headers();

	// validate state
	if (
		!code ||
		!returnedState ||
		!storedState ||
		returnedState !== storedState
	) {
		console.log("RETURNED STATE", returnedState);
		console.log("STORED STATE", storedState);
		// bad request
		return new Response(null, {
			status: 400,
		});
	}

	try {
		// Getting here
		console.log("GETTING HERE");

		const authResult = await authSystem.login("github", code);

		// const tokens = await new GitHub({
		// 	clientId: process.env.GITHUB_CLIENT_ID!,
		// 	clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		// 	redirectUri: "http://localhost:5173/auth/redirect/github",
		// }).handleRedirect(code);

		// TODO: I want to see it look like this:
		// const tokens = await AuthSystem.google.validateAuthorizationCode(code);
		// or t make general await AuthSystem[provider].validateAuthorizationCode(code);

		console.log("authResult:", authResult);

		if (authResult.type === "success") {
			console.log("SUCCESS");
			headers.append(
				"Set-Cookie",
				await commitSession({
					...authResult.authState,
				})
			);
			return redirect("/", {
				headers,
			});
		} else if (authResult.type === "redirect") {
			console.log("REDIRECT");
			return redirect(authResult.url);
		} else {
			throw new Error("Unknown authResult type");
		}

		// TODO: Store in database

		// const headers = new Headers();
		// headers.append(
		// 	"Set-Cookie",
		// 	await commitSession({
		// 		...tokens,
		// 	})
		// );
	} catch (e) {
		console.log("ERROR:", e);
	}
};
