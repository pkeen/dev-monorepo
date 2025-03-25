// --------------------------
// rbac.ts
// --------------------------
import { createModule } from "./module";
import { Policy, User } from "./types";

export function createRBAC() {
	// Just a stub set of policies
	const min: Policy<{ level: number }> = (user, { level }) => true;
	const max: Policy<{ level: number }> = (user, { level }) => true;
	const exact: Policy<{ roleName: string }> = (user, { roleName }) => true;

	const policies = { min, max, exact };

	return createModule<typeof policies, { roles: string[] }>({
		// Key part: "rbac" as const => literal
		name: "rbac" as const,
		policies,
		// Minimal stubs
		getItemsForUser: async (user: User) => {
			return { roles: ["User"] };
		},
		enrichUser: async (user: User) => {
			return { ...user, roles: ["User"] };
		},
	});
}
