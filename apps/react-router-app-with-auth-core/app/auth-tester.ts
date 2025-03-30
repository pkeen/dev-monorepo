import {
	AuthSystem,
	AuthManager,
	createAuthManager,
	type AuthNCallbacks,
	// type AuthConfig,
	createAuthCallbacks,
	type InferUserType,
	// createEnrichUser,
	type User,
	createEnrichUser,
} from "@pete_keen/authentication-core";
import { DrizzleAdapter } from "@pete_keen/authentication-core/adapters";
// import { JwtStrategy, JwtStrategyFn } from "@pete_keen/authentication-core";
// import { RBAC } from "@pete_keen/authentication-core/authorization";
import db from "~/db";

import { authz } from "./authz";

type DebugAuthz = typeof authz.enrichUser;
type __Type = typeof authz.__DataType;

const enrichUser = createEnrichUser(
	authz.enrichUser as typeof authz.enrichUser
);

const enrichedUserTest = await enrichUser({
	id: "123",
	name: "John",
	email: "",
	image: null,
});

console.log(enrichedUserTest.role);

const cb = createAuthCallbacks({
	enrichUser: createEnrichUser((user) => {
		return {
			...user,
			role: "admin",
		};
	}),
	onUserCreated: authz.onUserCreated,
	onUserUpdated: authz.onUserDeleted,
	onUserDeleted: authz.onUserDeleted,
});

const enrichedUserTest2 = await cb.enrichUser({
	id: "123",
	name: "John",
	email: "",
	image: null,
});

type Debug = Awaited<ReturnType<(typeof cb)["enrichUser"]>>;

console.log(enrichedUserTest2);

const authManager = createAuthManager({
	strategy: "jwt",
	jwtConfig: {
		access: {
			name: "access", // for now the names NEED to be access and refresh
			secretKey: "asfjsdkfj",
			algorithm: "HS256",
			expiresIn: "30 minutes",
			fields: ["id", "email"], // TODO: this currently does nothing
		},
		refresh: {
			name: "refresh",
			secretKey: "jldmff",
			algorithm: "HS256",
			expiresIn: "30 days",
			fields: ["id"],
		},
	},
	adapter: DrizzleAdapter(db),
	callbacks: {
		enrichUser: authz.enrichUser,
		onUserCreated: authz.onUserCreated,
		onUserUpdated: authz.onUserDeleted,
		onUserDeleted: authz.onUserDeleted,
	},
});

const erTest3 = await authManager.callbacks.enrichUser({
	id: "123",
	name: "John",
	email: "",
	image: null,
});
