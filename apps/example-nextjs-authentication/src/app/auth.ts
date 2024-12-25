"use server";
import {
	NextAuthentication,
	NextSessionStateStorage,
} from "@pete_keen/nextjs-authentication";
import {
	DrizzleAdapter,
	JwtConfig,
	AuthConfig,
} from "@pete_keen/authentication-core";
import db from "../lib/db";
// import { db } from "../lib/db";

const jwtConfig: JwtConfig = {
	access: {
		key: "pk-auth-access",
		secretKey: process.env.JWT_ACCESS_SECRET_KEY || "asfjsdkfj",
		algorithm: "HS256",
		expiresIn: "30 minutes",
		fields: ["id", "email"],
	},
	refresh: {
		key: "pk-auth-refresh",
		secretKey: process.env.JWT_REFRESH_SECRET_KEY || "jldmff",
		algorithm: "HS256",
		expiresIn: "30 days",
		fields: ["id"],
	},
};

// const transportAdapter = new NextAppTransportAdapter();
// const databaseAdapter = TestAdapter();
const databaseAdapter = DrizzleAdapter(db);

const authConfig: AuthConfig = {
	strategy: "jwt",
	jwtConfig: jwtConfig,
	adapter: databaseAdapter,
};

export const { authSystem, sessionStateStorage, login } =
	NextAuthentication(authConfig);
