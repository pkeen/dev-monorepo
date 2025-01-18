import { createCookie, redirect, type ActionFunctionArgs } from "react-router";
import { stateCookie, codeVerifierCookie } from "~/session.server";
// import * as oslo from "oslo/oauth2";
import { GoogleClient } from "./googleClient";

// export const google = new arctic.Google(
// 	process.env.GOOGLE_CLIENT_ID!,
// 	process.env.GOOGLE_CLIENT_SECRET!,
// 	"http://localhost:5173/auth/callback/google"
// );

export const requestAuthorization = async ({ request }: ActionFunctionArgs) => {
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

	const client = new GoogleClient(
		process.env.GOOGLE_CLIENT_ID!,
		process.env.GOOGLE_CLIENT_SECRET!
	);

	// const state = oslo.generateState();
	// const codeVerifier = oslo.generateCodeVerifier();
	// const scopes = ["openid", "profile", "email"];
	const url = client.createAuthorizationUrl();
	const state = client.getState();

	console.log("SCOPES:", client.getScopes());

	// console.log("URL:", url);

	// const url = google.createAuthorizationURL(state, codeVerifier, scopes);

	// console.log("Authorization URL:", url);
	// console.log("state:", state);
	// console.log("codeVerifier:", codeVerifier);

	headers.append("Set-Cookie", await stateCookie.serialize(state));
	// headers.append(
	// 	"Set-Cookie",
	// 	await codeVerifierCookie.serialize(codeVerifier)
	// );

	return redirect(url, {
		headers,
	});
};
