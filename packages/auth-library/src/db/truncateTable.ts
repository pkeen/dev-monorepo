import { Table, getTableName, sql } from "drizzle-orm";
import { DrizzleDB } from "./types";
// import type { db } from "@db/index";

// Reset tables
async function truncateTable(db: DrizzleDB, table: Table) {
	return db.execute(
		sql.raw(
			`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`
		)
	);
}

export default truncateTable;
