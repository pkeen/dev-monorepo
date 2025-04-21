import db from "@/db";
import { usersTable, rolesTable, userRolesTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type EnrichedUser = {
	id: string;
	email: string | null;
	name: string | null;
	role: string | null;
};

export async function getEnrichedUsers(): Promise<EnrichedUser[]> {
	return await db
		.select({
			id: usersTable.id,
			email: usersTable.email,
			name: usersTable.name,
			role: rolesTable.name,
		})
		.from(usersTable)
		.leftJoin(userRolesTable, eq(usersTable.id, userRolesTable.userId))
		.leftJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id));
}
