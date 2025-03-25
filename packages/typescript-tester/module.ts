// --------------------------
// module.ts
// --------------------------
import { Policy, User, Module } from "./types";

export function createModule<
	Policies extends Record<string, Policy<any>>,
	EnrichedData extends Record<string, any> = {}
>(config: {
	name: string;
	policies: Policies;
	init?: () => Promise<void>;
	enrichUser?: (user: User) => Promise<User & EnrichedData>;
	getItemsForUser: (user: User) => Promise<EnrichedData>;
}): Module<Policies, EnrichedData> {
	return {
		name: config.name,
		policies: config.policies,
		init: config.init,
		enrichUser: config.enrichUser,
		getItemsForUser: config.getItemsForUser,
	};
}
