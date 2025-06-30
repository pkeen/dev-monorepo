import courseSeed from "./coursesRemakeSeed";
import rolesSeed from "./roles";
import { config } from "dotenv";

const seed = async () => {
	// console.log("db url", process.env.DATABASE_URL);
	await courseSeed();
	await rolesSeed();
};

seed();
