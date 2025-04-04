// seed.ts
// await (async () => {
// 	import("dotenv").then((dotenv) => dotenv.config());

// 	const { rbac } = await import("~/authz");
// 	await rbac.init();
// })();

export default async () => {
	import("dotenv").then((dotenv) => dotenv.config());
	const { rbac } = await import("~/authz");
	await rbac.init();
};
