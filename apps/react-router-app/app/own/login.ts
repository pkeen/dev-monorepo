import { createCookie, redirect, type ActionFunctionArgs } from "react-router";
import { stateCookie, codeVerifierCookie } from "~/session.server";
// import { GitHub } from "~/own/github/github-client";
import { GitHub } from "@pete_keen/authentication-core/providers";
import { GoogleClient } from "~/own/googleClient";

const providers = {
	github: new GitHub({
		clientId: process.env.GITHUB_CLIENT_ID!,
		clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		redirectUri: "http://localhost:5173/auth/redirect/github",
	}),
	google: new GoogleClient({
		clientId: process.env.GOOGLE_CLIENT_ID!,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		redirectUri: "http://localhost:5173/auth/redirect/google",
	}),
};

export const login = async ({ request }: { request: Request }) => {
	const headers = new Headers(request.headers);
	const formData = await request.formData();

	const provider = formData.get("provider");
	const client = providers[provider];
	console.log("PROVIDER:", provider);

	// const url = c.createAuthorizationUrl();
	const url = client.createAuthorizationUrl();
	console.log("URL:", url);
	const state = client.getState();
	console.log("STATE:", state);

	headers.append("Set-Cookie", await stateCookie.serialize(state));

	return redirect(url, {
		headers,
	});
};
