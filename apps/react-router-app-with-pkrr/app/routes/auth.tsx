// const authLoader = ({ request, params }) => {
// 	const { action, provider } = params;
// 	console.log("ACTION:", action);
// 	console.log("PROVIDER:", provider);
// 	return null;
// };

// const authAction = ({ request, params }) => {
//     const { action, provider } = params;
//     console.log("ACTION:", action);
//     console.log("PROVIDER:", provider);
//     return null;
// };
import { Auth, type RRAuthConfig } from "../lib/auth/rr-auth";
import { DrizzleAdapter } from "@pete_keen/authentication-core/adapters";
import db from "../lib/db";
import {
	Google,
	GitHub,
	Zoom,
	Microsoft,
	Facebook,
} from "@pete_keen/authentication-core/providers";
import { Form } from "react-router";

if (!process.env.JWT_ACCESS_SECRET) {
	// throw new Error("JWT_ACCESS_SECRET not found in process.env");
	console.log(
		"process.env.JWT_ACCESS_SECRET:",
		process.env.JWT_ACCESS_SECRET
	);
}

if (!process.env.JWT_REFRESH_SECRET) {
	// throw new Error("JWT_REFRESH_SECRET not found in process.env");
	console.log(
		"process.env.JWT_REFRESH_SECRET:",
		process.env.JWT_REFRESH_SECRET
	);
}

const jwtOptions = {
	access: {
		name: "access",
		secretKey:
			process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "",
		algorithm: "HS256",
		expiresIn: "30 minutes",
		fields: ["id", "email"],
	},
	refresh: {
		name: "refresh",
		secretKey:
			process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "",
		algorithm: "HS256",
		expiresIn: "7 days",
		fields: ["id"],
	},
};

const databaseAdapter = DrizzleAdapter(db);

const config: RRAuthConfig = {
	strategy: "jwt",
	jwtConfig: jwtOptions,
	adapter: databaseAdapter,
	providers: [
		new Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/google",
		}),
		new GitHub({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/github",
		}),
		new Zoom({
			clientId: process.env.ZOOM_CLIENT_ID!,
			clientSecret: process.env.ZOOM_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/zoom",
		}),
		new Microsoft({
			clientId: process.env.MICROSOFT_CLIENT_ID!,
			clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/microsoft",
		}),
		new Facebook({
			clientId: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/facebook",
		}),
	],
	logger: {
		level: "debug",
	},
	redirectAfterLogin: "/",
	redirectAfterLogout: "/",
	sessionSecret: "asfjsdkfj",
};

const { login, logout, authLoader, authAction } = Auth(config);

export const loader = authLoader;
export const action = authAction;

// export { loader, action };

export default function AuthComponent({ loaderData }: { loaderData: any }) {
	switch (loaderData.page) {
		case "login":
			return (
				<div>
					<Form method="post">
						<button type="submit" value="google" name="provider">
							Login with Google
						</button>
						--
						<br />
						<button type="submit" value="github" name="provider">
							Login with GitHub
						</button>
						--
						<br />
						<button type="submit" value="zoom" name="provider">
							Login with Zoom
						</button>
						<br />
						<button type="submit" value="microsoft" name="provider">
							Login with Microsoft
						</button>
						<br />
						<button type="submit" value="facebook" name="provider">
							Login with Facebook
						</button>
					</Form>
				</div>
			);
		case "error":
			return (
				<div>
					<h1>Error</h1>
					<p>{loaderData.error}</p>
				</div>
			);
		default:
			return (
				<div>
					<h1>Auth</h1>
				</div>
			);
	}
}
