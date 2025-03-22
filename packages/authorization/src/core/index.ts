import { Policy } from "./policy";

export interface Module<EnrichedData extends Record<string, any> = {}> {
	name: string;
	policies: Record<string, Policy<any>>;
	pluralName?: string;
	hierachical?: boolean;
	init?: () => void;
	enrichUser?: (userId: string) => Promise<EnrichedData>;
	// level?: number;
}

// export type HierachicalModule = Module & { hierachical: true; level: number };
export interface HierachicalModule extends Module {
	hierachical: true;
	level: number;
}

export type AnyModule = Module | HierachicalModule;

export interface AuthZ {
	// Heres the choice, do we take an entities object/array and put all Roles, Permissions, Orgs etc in there
	// or do we have a Roles object, a Permissions object, and a custom entities object?

	modules: Record<string, AnyModule>;
	// should the schema and table be returned to user to add to their own migrations? probably yes
	// schemaName?: string; // ??? this needs to actually be at the level of the adpater I think

	policies: Record<string, Policy<any>>;
}

export interface AuthZConfig {
	modules: Array<AnyModule>;
	// policies: Record<string, Policy<any>>; // maybe not policy creation for now
}

export const AuthZ = (config: AuthZConfig) => {
	// Ensure reduce returns Record<string, AnyModule>
	const modulesDict = config.modules.reduce(
		(acc, module) => {
			acc[module.name] = module; // Explicitly assigning the module object
			return acc;
		},
		{} as Record<string, AnyModule> // TypeScript will now infer correctly
	);

	// Optionally, you can initialize them or do more logic here
	for (const modName in modulesDict) {
		modulesDict[modName].init?.();
	}

	// Ensure reduce returns Record<string, Record<string, Policy<any>>>
	const policiesDict = config.modules.reduce((acc, module) => {
		acc[module.name] = module.policies ?? {};
		return acc;
	}, {} as Record<string, Record<string, Policy<any>>>);

	const enrichUser = async (user: { id: string }) => {
		for (const modName in modulesDict) {
			if (modulesDict[modName].enrichUser) {
				const enriched = await modulesDict[modName].enrichUser(user.id);
				return { ...user, ...enriched };
			}
		}
		return user;
	};

	return {
		modules: modulesDict,
		policies: policiesDict,
		enrichUser,
	};
};
