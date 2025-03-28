export const createEnrichUser = <
	U extends { id: string },
	E extends Record<string, any>
>(
	fn: (user: U) => Promise<U & E>
) => fn;

const enrichUser = createEnrichUser(async (user) => {
	return {
		...user,
		roles: ["admin"],
		team: "Engineering",
	};
});

const enrichedUser = await enrichUser({
	id: "123",
	name: "John Doe",
	email: "john.doe@example.com",
	image: null,
});

console.log(enrichedUser.id);
