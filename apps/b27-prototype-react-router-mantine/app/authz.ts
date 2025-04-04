import { buildAuthZ, rbacModule } from "@pete_keen/authz";
import { RBACAdapter } from "@pete_keen/authz/adapters";
import db from "~/lib/db/index.server";

const dbAdapter = RBACAdapter(db);

export const rbac = rbacModule(dbAdapter, {
	items: [
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
	],
	defaultAssignment: { key: "user" },
});

export const authz = await buildAuthZ({ modules: [rbac] });
