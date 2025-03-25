import { AnyModule, User, Module, HierachicalModule } from "./simpler-module";

/**
 * Extract the EnrichedData from any type of module
 * (Module or HierachicalModule).
 */
// type ExtractEnrichedData<M extends AnyModule> =
//   M extends Module<infer _Pol, infer E> ? E :
//   M extends HierachicalModule<infer _Pol, infer E> ? E :
//   never;
// without generic policies for now:
type ExtractEnrichedData<M extends AnyModule> = M extends Module<infer E>
	? E
	: M extends HierachicalModule<infer E>
	? E
	: never;

/**
 * Converts a union of types (A | B | C) into an intersection (A & B & C).
 * Classic TS trick using distributive conditional types.
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
	k: infer I
) => void
	? I
	: never;

/**
 * Given an array of modules, gather up all the "EnrichedData"
 * from each module, producing a single intersection type.
 */
type ModulesEnrichedData<A extends AnyModule[]> = UnionToIntersection<
	ExtractEnrichedData<A[number]>
>;

/**
 * Takes an array of modules, calls init() if present,
 * and returns an object of combined lifecycle methods.
 */
export async function buildAuthZ<A extends AnyModule[]>(modules: A) {
	// 1) Initialize all modules
	for (const mod of modules) {
		await mod.init?.();
	}

	// 2) We'll produce a typed aggregator function
	type MergedData = ModulesEnrichedData<A>;

	const enrichUser = async (baseUser: User): Promise<User & MergedData> => {
		console.log("GETTING INTO ENRICH USER AGGREGATOR, USER:", baseUser);
		let result = { ...baseUser } as User & Partial<MergedData>;
		for (const mod of modules) {
			if (mod.enrichUser) {
				const modEnriched = await mod.enrichUser(result);
				// Spread the newly added fields
				result = { ...result, ...modEnriched };
			}
		}
		// By the end, result includes all modules' fields
		console.log("ENRICH USER AGGREGATOR RESULT:", result);
		return result as User & MergedData;
	};

	const executeLifecycleCallbacks = async (
		callbackName: "onUserCreated" | "onUserDeleted",
		user: User
	): Promise<void> => {
		for (const mod of modules) {
			if (mod[callbackName]) {
				await (mod[callbackName] as (user: User) => Promise<void>)(
					user
				);
			}
		}
	};
	// 2) Construct aggregated lifecycle
	const userLifecycle = {
		enrichUser,
		onUserCreated: (user: User) =>
			executeLifecycleCallbacks("onUserCreated", user),
		onUserDeleted: (user: User) =>
			executeLifecycleCallbacks("onUserDeleted", user),
	};

	// Return a combined object, or just the lifecycle if you prefer
	return {
		...userLifecycle,
	};
}
