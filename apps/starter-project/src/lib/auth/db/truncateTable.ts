import { Table, getTableName, sql } from "drizzle-orm";
import type { db } from "@/lib/auth/db";

// Reset tables
async function truncateTable(db: db, table: Table) {
	return db.execute(
		sql.raw(
			`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`
		)
	);
}

export default truncateTable;
