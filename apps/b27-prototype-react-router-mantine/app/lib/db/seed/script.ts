import courseSeed from "./courses";
import rolesSeed from "./roles";

const seed = async () => {
	await courseSeed();
	await rolesSeed();
};

seed();
