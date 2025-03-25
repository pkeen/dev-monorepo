// index.ts
import { Role } from "./types";
import { rbacModule, RBACConfig } from "./rbac-module";

// 1) We define a roles array
const roles = [
	{ key: "admin", name: "Admin", level: 2 },
	{ key: "user", name: "User", level: 1 },
] as const; // typed as ReadonlyArray<Role>

// 2) The config referencing that array
const config: RBACConfig<typeof roles> = {
	items: roles,
	defaultAssignment: { name: "User" },
};

// 3) Build the rbac module
const rbac = rbacModule(someDbAdapter, config);
// => rbac is typed as RBACModule<typeof roles>

// 4) Use typed policies!
const user = { id: "123", roles: [{ key: "admin", name: "Admin", level: 2 }] };

// Now TypeScript knows min => (user: { id: string; roles: Role[] }, roleSelect: ExtendedSelectRole<T>) => boolean
rbac.policies.min(user, { level: 2 });
// no more "any" – you get autocomplete for `level`, `name`, or `key` in the second arg

// Use updateUserRole with typed "select"
rbac.updateUserRole("123", { name: "Admin" });
rbac.updateUserRole("123", { key: "user" });

rbac.policies.min(user, { key: "user" });
