// import { drizzle } from "drizzle-orm/neon-http";
// // import { env } from "@/utils/env";
// import { getAuthConfig } from "../config";

// // Have option for application to import its own db instance
// console.log("process.env.DATABASE_URL:", process.env.DATABASE_URL);

// const authConfig = getAuthConfig();

// console.log("authConfig.databaseUrl:", authConfig.databaseUrl);

// const db = drizzle(process.env.DATABASE_URL, {
// 	logger: true,
// 	casing: "snake_case",
// });

// export type db = typeof db;

// export default db;
// export * as queries from "./queries";
// export * as seeds from "./seeds";
