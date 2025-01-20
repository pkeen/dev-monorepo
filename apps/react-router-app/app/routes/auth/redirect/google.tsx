import {
	stateCookie,
	codeVerifierCookie,
	commitSession,
} from "~/session.server";
import { GoogleClient } from "~/own/googleClient";
// import * as oslo from "oslo/oauth2";
import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	// Retrieve the stored state and codeVerifier from cookies
	const cookieHeader = request.headers.get("Cookie");
	const storedState = await stateCookie.parse(cookieHeader);
	// const codeVerifier = await codeVerifierCookie.parse(cookieHeader);
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const returnedState = url.searchParams.get("state");
	console.log("returned URL:", url);

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
		const tokens = await new GoogleClient({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/google",
		}).validateAuthorizationCode(code);

		// TODO: I want to see it look like this:
		// const tokens = await AuthSystem.google.validateAuthorizationCode(code);
		// or t make general await AuthSystem[provider].validateAuthorizationCode(code);

		console.log("TOKENS:", tokens);
		// const accessToken = tokens.accessToken();
		// const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
		// // Youd then probably want to store the access token in a database
		// const idToken = tokens.idToken();
		// const claims = arctic.decodeIdToken(idToken);

		// console.log("Access Token:", accessToken);
		// console.log("Access Token Expires At:", accessTokenExpiresAt);
		// console.log("Claims:", claims);

		// TODO: Store in database

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
		console.log("ERROR:", e);
		// if (e instanceof oslo.OAuth2RequestError) {
		// 	// Invalid authorization code, credentials, or redirect URI
		// 	// const code = e.code;
		// 	const { request, message, description } = e;
		// 	console.log("REQUEST:", request);
		// 	console.log("MESSAGE:", message);
		// 	console.log("DESCRIPTION:", description);
		// 	// ...
		// }
		// if (e instanceof oslo.ArcticFetchError) {
		// 	// Failed to call `fetch()`
		// 	const cause = e.cause;
		// 	// ...
		// }
		// Parse error
	}
};
