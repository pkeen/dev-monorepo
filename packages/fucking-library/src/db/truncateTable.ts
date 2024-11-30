import { Table, getTableName, sql } from "drizzle-orm";
// import type { db } from "@db/index";

// Reset tables
async function truncateTable(db, table: Table) {
	return db.execute(
		sql.raw(
			`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`
		)
	);
}

export default truncateTable;
