// import * as arctic from "arctic";
// import { createCookie, redirect } from "react-router";
// import { stateCookie, codeVerifierCookie } from "~/session.server";
// import { requestAuthorization } from "~/arctic/requestAuthorization";
// import { requestAuthorization } from "~/oslo/requestAuthorization";
// import { requestAuthorization } from "~/own/requestAuthorization";
// import { requestAuthorization } from "~/own/github/requestAuthorization";
// import { GitHub } from "~/own/github/github-client";
// import { GoogleClient } from "~/own/googleClient";

import { login } from "~/own/login";

// const providers = { github: GitHub, google: GoogleClient };

export const action = login;

export default function Login() {
	return (
		<div>
			<form method="post">
				<button type="submit" value="google" name="provider">
					Login with Google
				</button>
				<button type="submit" value="github" name="provider">
					Login with GitHub
				</button>
			</form>
		</div>
	);
}

// export const action = async ({ request }) => {
// 	const headers = new Headers(request.headers);

// 	// const google = new arctic.Google({
// 	// 	clientId: process.env.GOOGLE_CLIENT_ID,
// 	// 	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// 	// 	redirectUri: "http://localhost:5173/auth/google/callback",
// 	// });
// 	const google = new arctic.Google(
// 		process.env.GOOGLE_CLIENT_ID!,
// 		process.env.GOOGLE_CLIENT_SECRET!,
// 		"http://localhost:5173/auth/callback/google"
// 	);

// 	// The state parameter is to prevent CSRF attacks
// 	const state = arctic.generateState();
// 	// Generate a codeVerifier for PKCE (Proof Key for Code Exchange)
// 	const codeVerifier = arctic.generateCodeVerifier();
// 	const scopes = ["openid", "profile"];
// 	const url = google.createAuthorizationURL(state, codeVerifier, scopes);

// 	console.log("Authorization URL:", url);
// 	console.log("state:", state);
// 	console.log("codeVerifier:", codeVerifier);

// 	headers.append("Set-Cookie", await stateCookie.serialize(state));
// 	headers.append(
// 		"Set-Cookie",
// 		await codeVerifierCookie.serialize(codeVerifier)
// 	);

// 	return redirect(url, {
// 		headers,
// 	});
// };
