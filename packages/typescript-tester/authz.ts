// --------------------------
// authz.ts
// --------------------------
import { IAuthZ, AuthZConfig, AnyModule, User, Module } from "./types";

// Helper: extracts literal name from a module
type ModuleName<M extends AnyModule> = M["name"] extends string
	? M["name"]
	: never;

// If the modules array is [rbacModule, somethingElse],
// we get { rbac: typeof rbacModule; somethingElse: typeof somethingElse }
type ModulesArrayToDict<A extends AnyModule[]> = {
	[Mod in A[number] as ModuleName<Mod>]: Mod;
};

export function AuthZ<A extends AnyModule[]>(
	config: AuthZConfig<A>
): IAuthZ<ModulesArrayToDict<A>> {
	// Convert array -> dictionary
	const modulesDict = config.modules.reduce((acc, mod) => {
		acc[mod.name] = mod;
		return acc;
	}, {} as ModulesArrayToDict<A>);

	// Build policies dictionary
	// Good old 'for in' to build the policies dictionary
	const policiesDict = {} as IAuthZ<ModulesArrayToDict<A>>["policies"];
	for (const modName in modulesDict) {
		const mod = modulesDict[modName] as Module<any, any>;
		policiesDict[modName] = mod.policies;
	}

	const enrichUser = async (user: User) => {
		let output = { ...user };
		for (const modName in modulesDict) {
			const mod = modulesDict[modName] as Module<any, any>;
			if (mod.enrichUser) {
				const enriched = await mod.enrichUser(output);
				output = { ...output, ...enriched };
			}
		}

		return output;
	};

	const onUserCreated = async (user: User) => {
		console.log("User created:", user.id);
	};

	return {
		modules: modulesDict,
		policies: policiesDict,
		userLifecycle: {
			enrichUser,
			onUserCreated,
		},
	};
}
