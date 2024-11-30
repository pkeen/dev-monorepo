// import { NeonDatabase } from "@neondatabase/serverless";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
// import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import { PgDatabase } from "drizzle-orm/pg-core";

export type DrizzleDB = NeonHttpDatabase;
