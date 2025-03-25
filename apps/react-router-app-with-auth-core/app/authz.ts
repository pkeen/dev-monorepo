import { RBACAdapter } from "@pete_keen/authz/adapters";
import { AuthZ, rbacModule, buildAuthZ } from "@pete_keen/authz";
import db from "~/db";
import type { AuthZConfig } from "node_modules/@pete_keen/authz/dist/core/types";

const roles = [
	{
		key: "guest",
		name: "Guest",
		level: 0,
	},
	{
		key: "user",
		name: "User",
		level: 1,
	},
	{
		key: "editor",
		name: "Editor",
		level: 2,
	},
	{
		key: "admin",
		name: "Admin",
		level: 3,
	},
	{
		key: "super-admin",
		name: "Super Admin",
		level: 4,
	},
] as const; // marking as const allows Typescript to infer elements as literal types

const dbAdapter = RBACAdapter(db);

// export const rbac = createRBAC(dbAdapter, {
// 	items: roles,
// 	defaultAssignment: {
// 		key: "user",
// 	},
// });

// const authzConfig = {
// 	modules: [rbac],
// } satisfies AuthZConfig<[typeof rbac]>;

// export const authz = AuthZ(authzConfig);

// export const authz = RBAC(RBACAdapter(db), {
// 	roles,
// 	defaultRole: {
// 		name: "User",
// 	},
// });

// this going to be circular dependency, so we need to extract it to a separate file

export const rbac = rbacModule(dbAdapter, {
	items: roles,
	defaultAssignment: { key: "user" }, // TODO this seems kinda pointless now, we might aswell always select by key - a lot simpler
});

export const { enrichUser, onUserCreated } = await buildAuthZ([rbac]);
