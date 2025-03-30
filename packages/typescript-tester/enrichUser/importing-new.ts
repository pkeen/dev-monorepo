import { authManager } from "./new";

const enrichedUser = await authManager.callbacks.enrichUser({
	id: "123",
	name: "John Doe",
	email: "john.doe@example.com",
	image: null,
});

console.log(enrichedUser.team);
