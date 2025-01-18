import {
	stateCookie,
	codeVerifierCookie,
	commitSession,
} from "~/session.server";
import * as arctic from "arctic";
// import { google } from "~/routes/auth/login";
import { redirect } from "react-router";
// import { redirectAction } from "~/arctic/redirect";
// import { redirectAction } from "~/oslo/redirect";
import { redirectAction } from "~/own/redirect";

export const loader = redirectAction;

// export const loader = async ({ request }) => {
// 	// With Arctic

// 	// Retrieve the stored state and codeVerifier from cookies
// 	const cookieHeader = request.headers.get("Cookie");
// 	const storedState = await stateCookie.parse(cookieHeader);
// 	const codeVerifier = await codeVerifierCookie.parse(cookieHeader);
// 	const url = new URL(request.url);
// 	const code = url.searchParams.get("code");
// 	const returnedState = url.searchParams.get("state");

// 	// validate state
// 	if (
// 		!code ||
// 		!returnedState ||
// 		!storedState ||
// 		returnedState !== storedState
// 	) {
// 		// bad request
// 		return new Response(null, {
// 			status: 400,
// 		});
// 	}

// 	try {
// 		const tokens = await google.validateAuthorizationCode(
// 			code,
// 			codeVerifier
// 		);

// 		console.log("TOKENS:", tokens);
// 		const accessToken = tokens.accessToken();
// 		const accessTokenExpiresAt = tokens.accessTokenExpiresAt();
// 		// Youd then probably want to store the access token in a database
// 		const idToken = tokens.idToken();
// 		const claims = arctic.decodeIdToken(idToken);

// 		console.log("Access Token:", accessToken);
// 		console.log("Access Token Expires At:", accessTokenExpiresAt);
// 		console.log("Claims:", claims);

// 		const headers = new Headers();
// 		headers.append(
// 			"Set-Cookie",
// 			await commitSession({
// 				accessToken,
// 				accessTokenExpiresAt,
// 				claims,
// 			})
// 		);

// 		return redirect("/", {
// 			headers,
// 		});
// 	} catch (e) {
// 		if (e instanceof arctic.OAuth2RequestError) {
// 			// Invalid authorization code, credentials, or redirect URI
// 			const code = e.code;
// 			// ...
// 		}
// 		if (e instanceof arctic.ArcticFetchError) {
// 			// Failed to call `fetch()`
// 			const cause = e.cause;
// 			// ...
// 		}
// 		// Parse error
// 	}

// 	// try {
// 	// 	const tokens = await google.validateAuthorizationCode(
// 	// 		code,
// 	// 		storedCodeVerifier
// 	// 	);
// 	// 	const accessToken = tokens.accessToken();
// 	// 	console.log("Access Token:", accessToken);
// 	// 	return new Response(null, {
// 	// 		status: 200,
// 	// 	});
// 	// } catch (e) {
// 	// 	if (e instanceof arctic.OAuth2RequestError) {
// 	// 		// Invalid authorization code, credentials, or redirect URI
// 	// 		const code = e.code;
// 	// 		// ...
// 	// 	}
// 	// 	if (e instanceof arctic.ArcticFetchError) {
// 	// 		// Failed to call `fetch()`
// 	// 		const cause = e.cause;
// 	// 		// ...
// 	// 	}
// 	// }
// 	// // Parse error
// };
