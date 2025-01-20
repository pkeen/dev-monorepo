import { redirect } from "react-router";
import { GitHub } from "~/own/github/github-client";
import { stateCookie, codeVerifierCookie } from "~/session.server";
// import { GoogleClient } from "~/own/googleClient";

const providers = { GitHub };

export const requestAuthorization = async ({ request }: any) => {
	const provider = new providers.GitHub(
		process.env.GITHUB_CLIENT_ID!,
		process.env.GITHUB_CLIENT_SECRET!
	);

	const url = provider.createAuthorizationUrl();

	console.log("Authorization URL:", url);

	const state = provider.getState();

	console.log("state:", state);

	const headers = new Headers(request.headers);

	headers.append("Set-Cookie", await stateCookie.serialize(state));

	return redirect(url, {
		headers,
	});
};
