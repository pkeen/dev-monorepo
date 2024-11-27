import { loadEnv } from "./loadEnv";

// Load environment variables
loadEnv();

console.log("DB URL:", process.env.DATABASE_URL);
console.log("Secret: ", process.env.JWT_SECRET);
