import {
	stateCookie,
	codeVerifierCookie,
	commitSession,
} from "~/session.server";
import { googleClient } from "./googleClient";
import * as oslo from "oslo/oauth2";

// import { google } from "./requestAuthorization";
import { redirect } from "react-router";

export const redirectAction = async ({ request }) => {
	// With Oslo

	// Retrieve the stored state and codeVerifier from cookies
	const cookieHeader = request.headers.get("Cookie");
	const storedState = await stateCookie.parse(cookieHeader);
	const codeVerifier = await codeVerifierCookie.parse(cookieHeader);
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const returnedState = url.searchParams.get("state");

	// validate state
	if (
		!code ||
		!returnedState ||
		!storedState ||
		returnedState !== storedState
	) {
		// bad request
		return new Response(null, {
			status: 400,
		});
	}

	try {
		// Getting here
		console.log("GETTING HERE");
		const tokens = await googleClient().validateAuthorizationCode<{
			refreshToken: string;
		}>(code, {
			codeVerifier,
		});

		console.log("TOKENS:", tokens);
		// const accessToken = tokens.accessToken();
		// const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
		// // Youd then probably want to store the access token in a database
		// const idToken = tokens.idToken();
		// const claims = arctic.decodeIdToken(idToken);

		// console.log("Access Token:", accessToken);
		// console.log("Access Token Expires At:", accessTokenExpiresAt);
		// console.log("Claims:", claims);

		const headers = new Headers();
		headers.append(
			"Set-Cookie",
			await commitSession({
				...tokens,
			})
		);

		return redirect("/", {
			headers,
		});
	} catch (e) {
		if (e instanceof oslo.OAuth2RequestError) {
			// Invalid authorization code, credentials, or redirect URI
			// const code = e.code;
			const { request, message, description } = e;
			console.log("REQUEST:", request);
			console.log("MESSAGE:", message);
			console.log("DESCRIPTION:", description);
			// ...
		}
		// if (e instanceof oslo.ArcticFetchError) {
		// 	// Failed to call `fetch()`
		// 	const cause = e.cause;
		// 	// ...
		// }
		// Parse error
	}
};
