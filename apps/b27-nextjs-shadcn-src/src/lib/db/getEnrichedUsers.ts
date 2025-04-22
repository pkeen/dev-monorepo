import db from "@/db";
import { usersTable, rolesTable, userRolesTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

type EnrichedUser = {
	id: string;
	email: string;
	name: string;
	role?: string | null;
	roleId?: string | null;
};

export async function getEnrichedUsers(): Promise<EnrichedUser[]> {
	return await db
		.select({
			id: usersTable.id,
			email: usersTable.email,
			name: usersTable.name,
			role: rolesTable.name,
			roleId: rolesTable.id,
		})
		.from(usersTable)
		.leftJoin(userRolesTable, eq(usersTable.id, userRolesTable.userId))
		.leftJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id));
}

export async function getEnrichedUserById(
	id: string
): Promise<EnrichedUser | null> {
	const result = await db
		.select({
			id: usersTable.id,
			email: usersTable.email,
			name: usersTable.name,
			role: rolesTable.name,
			roleId: rolesTable.id,
		})
		.from(usersTable)
		.leftJoin(userRolesTable, eq(usersTable.id, userRolesTable.userId))
		.leftJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
		.where(eq(usersTable.id, id))
		.limit(1);

	return result[0] ?? null;
}
