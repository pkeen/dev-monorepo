import {
	GitHub,
	Google,
	Zoom,
	Microsoft,
} from "@pete_keen/authentication-core/providers";

// export const providers = {
// 	github: new GitHub({
// 		clientId: process.env.GITHUB_CLIENT_ID!,
// 		clientSecret: process.env.GITHUB_CLIENT_SECRET!,
// 		redirectUri: "http://localhost:5173/auth/redirect/github",
// 	}),
// };
import { createLogger } from "@pete_keen/logger";
import { AuthSystem } from "@pete_keen/authentication-core";
import { DrizzleAdapter } from "@pete_keen/authentication-core/adapters";
import { JwtStrategy } from "@pete_keen/authentication-core";
import db from "~/db";

const logger = createLogger({
	level: "debug",
});

const authSystem = new AuthSystem(
	new JwtStrategy({
		access: {
			key: "pk-auth-access",
			secretKey: "asfjsdkfj",
			algorithm: "HS256",
			expiresIn: "30 minutes",
			fields: ["id", "email"],
		},
		refresh: {
			key: "pk-auth-refresh",
			secretKey: "jldmff",
			algorithm: "HS256",
			expiresIn: "30 days",
			fields: ["id"],
		},
	}),
	new DrizzleAdapter(db),
	logger
);

authSystem.registerProvider(
	"github",
	new GitHub({
		clientId: process.env.GITHUB_CLIENT_ID!,
		clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		redirectUri: "http://localhost:5173/auth/redirect/github",
	})
);

authSystem.registerProvider(
	"zoom",
	new Zoom({
		clientId: process.env.ZOOM_CLIENT_ID!,
		clientSecret: process.env.ZOOM_CLIENT_SECRET!,
		redirectUri: "http://localhost:5173/auth/redirect/zoom",
	})
);

authSystem.registerProvider(
	"google",
	new Google({
		clientId: process.env.GOOGLE_CLIENT_ID!,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		redirectUri: "http://localhost:5173/auth/redirect/google",
	})
);

authSystem.registerProvider(
	"microsoft",
	new Microsoft({
		clientId: process.env.MICROSOFT_CLIENT_ID!,
		clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
		redirectUri: "http://localhost:5173/auth/redirect/microsoft",
	})
);

// TODO: improve authSystem.registerProvider method - I dont want the key defined by user

export default authSystem;
