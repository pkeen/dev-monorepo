import { JwtStrategy } from "@pete_keen/authentication-core";
import { AuthSystem } from "@pete_keen/authentication-core";
import { NextAppTransportAdapter } from "@pete_keen/authentication-core/transporters";
import { JwtConfig } from "@pete_keen/authentication-core";

const jwtOptions: JwtConfig = {
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

const jwtStrategy = new JwtStrategy(jwtOptions);
const transportAdapter = new NextAppTransportAdapter();
export const authSystem = new AuthSystem(jwtStrategy, transportAdapter);
