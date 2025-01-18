import { createCookie, redirect } from "react-router";
import { stateCookie, codeVerifierCookie } from "~/session.server";
import * as oslo from "oslo/oauth2";
import { googleClient } from "./googleClient";

// export const google = new arctic.Google(
// 	process.env.GOOGLE_CLIENT_ID!,
// 	process.env.GOOGLE_CLIENT_SECRET!,
// 	"http://localhost:5173/auth/callback/google"
// );

export const requestAuthorization = async ({ request }) => {
	// const clientId = process.env.GOOGLE_CLIENT_ID!;

	const headers = new Headers(request.headers);

	// const authorizeEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";

	// const tokenEndpoint = "https://oauth2.googleapis.com/token";

	// const client = new oslo.OAuth2Client(
	// 	clientId,
	// 	authorizeEndpoint,
	// 	tokenEndpoint,
	// 	{
	// 		redirectURI: "http://localhost:5173/auth/callback/google",
	// 	}
	// );

	const client = googleClient();

	const state = oslo.generateState();
	const codeVerifier = oslo.generateCodeVerifier();
	const scopes = ["openid", "profile", "email"];
	const url = await client.createAuthorizationURL({
		state,
		scopes,
		codeVerifier,
	});

	console.log("URL:", url);

	// const url = google.createAuthorizationURL(state, codeVerifier, scopes);

	// console.log("Authorization URL:", url);
	// console.log("state:", state);
	// console.log("codeVerifier:", codeVerifier);

	headers.append("Set-Cookie", await stateCookie.serialize(state));
	headers.append(
		"Set-Cookie",
		await codeVerifierCookie.serialize(codeVerifier)
	);

	return redirect(url, {
		headers,
	});
};
