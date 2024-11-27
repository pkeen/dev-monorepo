import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/utils/env";

// Have option for application to import its own db instance

const db = drizzle(env.DATABASE_URL, { logger: true, casing: "snake_case" });

export type db = typeof db;

export default db;
export * as queries from "./queries";
export * as seeds from "./seeds";
