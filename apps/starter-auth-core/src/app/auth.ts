import {
	JwtStrategy,
	JwtConfig,
	AuthSystem,
	// createAuthSystem,
} from "@pete_keen/authentication-core";
import {
	TestAdapter,
	DrizzleAdapter,
} from "@pete_keen/authentication-core/adapters";
import { NextSessionStateStorage } from "@pete_keen/nextjs-authentication";
import db from "../lib/db";
import { create } from "domain";

if (!process.env.JWT_ACCESS_SECRET) {
	throw new Error("JWT_ACCESS_SECRET not found in process.env");
}

if (!process.env.JWT_REFRESH_SECRET) {
	throw new Error("JWT_REFRESH_SECRET not found in process.env");
}

const jwtOptions: JwtConfig = {
	access: {
		key: "KeyCard-access",
		secretKey: process.env.JWT_ACCESS_SECRET | process.env.JWT_SECRET,
		algorithm: "HS256",
		expiresIn: "30 minutes",
		fields: ["id", "email"],
	},
	refresh: {
		key: "KeyCard-refresh",
		secretKey: process.env.JWT_REFRESH_SECRET | process.env.JWT_SECRET,
		algorithm: "HS256",
		expiresIn: "7 days",
		fields: ["id"],
	},
};

// const jwtStrategy = new JwtStrategy(jwtOptions);
// // const transportAdapter = new NextAppTransportAdapter();
// // const databaseAdapter = TestAdapter();
const databaseAdapter = DrizzleAdapter(db);

// export const authSystem = new AuthSystem(jwtStrategy, databaseAdapter);

// export const authSystem = createAuthSystem({
// 	strategy: "jwt",
// 	jwtConfig: jwtOptions,
// 	adapter: databaseAdapter,
// 	logger: {
// 		level: "debug",
// 	},
// });

export const authSystem = AuthSystem.create({
	strategy: "jwt",
	jwtConfig: jwtOptions,
	adapter: databaseAdapter,
	logger: {
		level: "debug",
	},
});

export const sessionStateStorage = new NextSessionStateStorage();
