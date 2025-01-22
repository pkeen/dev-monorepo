import { GitHub } from "@pete_keen/authentication-core/providers";

export const providers = {
	github: new GitHub({
		clientId: process.env.GITHUB_CLIENT_ID!,
		clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		redirectUri: "http://localhost:5173/auth/redirect/github",
	}),
};


