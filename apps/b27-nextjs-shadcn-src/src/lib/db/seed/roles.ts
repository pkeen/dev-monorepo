// seed.ts
export default async () => {
	import("dotenv").then((dotenv) => dotenv.config());
	const { rbac } = await import("@/authz");
	await rbac.init();
};
