import { RBACAdapter } from "@pete_keen/authz/adapters";
import { RBAC } from "@pete_keen/authz";
import db from "~/db";

const roles = [
	{
		name: "Guest",
		level: 0,
	},
	{
		name: "User",
		level: 1,
	},
	{
		name: "Editor",
		level: 2,
	},
	{
		name: "Admin",
		level: 3,
	},
	{
		name: "Super Admin",
		level: 4,
	},
] as const; // marking as const allows Typescript to infer elements as literal types

export const authz = RBAC(RBACAdapter(db), {
	roles,
	defaultRole: {
		name: "User",
	},
});

// this going to be circular dependency, so we need to extract it to a separate file
