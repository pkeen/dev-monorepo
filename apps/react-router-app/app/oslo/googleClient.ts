import * as oslo from "oslo/oauth2";

export function googleClient() {
	const clientId = process.env.GOOGLE_CLIENT_ID!;
	const authorizeEndpoint = "https://accounts.google.com/o/oauth2/v2/auth";
	const tokenEndpoint = "https://oauth2.googleapis.com/token";

	const client = new oslo.OAuth2Client(
		clientId,
		authorizeEndpoint,
		tokenEndpoint,
		{
			redirectURI: "http://localhost:5173/auth/callback/google",
		}
	);

	return client;
}
