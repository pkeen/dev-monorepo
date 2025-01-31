import { createCookie, redirect, type ActionFunctionArgs } from "react-router";
import { stateCookie, codeVerifierCookie } from "~/session.server";
// import { GitHub } from "~/own/github/github-client";
import authSystem from "~/auth";
// import { GoogleClient } from "~/own/googleClient";

// const providers = {
// 	github: new GitHub({
// 		clientId: process.env.GITHUB_CLIENT_ID!,
// 		clientSecret: process.env.GITHUB_CLIENT_SECRET!,
// 		redirectUri: "http://localhost:5173/auth/redirect/github",
// 	}),
// 	google: new GoogleClient({
// 		clientId: process.env.GOOGLE_CLIENT_ID!,
// 		clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
// 		redirectUri: "http://localhost:5173/auth/redirect/google",
// 	}),
// };

export const login = async ({ request }: { request: Request }) => {
	const headers = new Headers(request.headers);
	const formData = await request.formData();

	const provider = formData.get("provider");
	console.log("PROVIDER:", provider);

	if (!provider) {
		redirect("/auth/login");
	}

	const authResult = await authSystem.login(provider?.toString());

	if (authResult.type === "redirect") {
		headers.append(
			"Set-Cookie",
			await stateCookie.serialize(authResult.state)
		);
		console.log("authResult.url:", authResult.url);
		return redirect(authResult.url, { headers });
	}

	// const client = providers[provider];
	// console.log("PROVIDER:", provider);

	// const url = c.createAuthorizationUrl();
	// const url = client.createAuthorizationUrl();
	// console.log("URL:", url);
	// const state = client.getState();
	// console.log("STATE:", state);

	// return redirect(url, {
	// 	headers,
	// });
};
