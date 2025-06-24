import courseSeed from "./coursesSeed";
// import rolesSeed from "./roles";

const seed = async () => {
	// console.log("db url", process.env.DATABASE_URL);
	await courseSeed();
	// await rolesSeed();
};

seed();
