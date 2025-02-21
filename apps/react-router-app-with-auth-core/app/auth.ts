import {
	GitHub,
	Google,
	Zoom,
	Microsoft,
	Facebook,
} from "@pete_keen/authentication-core/providers";
import { createLogger } from "@pete_keen/logger";
import { AuthSystem } from "@pete_keen/authentication-core";
import { DrizzleAdapter } from "@pete_keen/authentication-core/adapters";
import { JwtStrategy } from "@pete_keen/authentication-core";
import { RBAC } from "@pete_keen/authentication-core/authorization";
import db from "~/db";

const logger = createLogger({
	level: "debug",
});

const authSystem = new AuthSystem(
	new JwtStrategy({
		access: {
			name: "access", // for now the names NEED to be access and refresh
			secretKey: "asfjsdkfj",
			algorithm: "HS256",
			expiresIn: "30 minutes",
			fields: ["id", "email"],
		},
		refresh: {
			name: "refresh",
			secretKey: "jldmff",
			algorithm: "HS256",
			expiresIn: "30 days",
			fields: ["id"],
		},
	}),
	DrizzleAdapter(db),
	RBAC(db),
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

authSystem.registerProvider(
	"facebook",
	new Facebook({
		clientId: process.env.FACEBOOK_CLIENT_ID!,
		clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
		redirectUri: "http://localhost:5173/auth/redirect/facebook",
	})
);
// TODO: improve authSystem.registerProvider method - I dont want the key defined by user
// console.log("Roles:", authSystem.rolesManager.listRoles());

export default authSystem;
