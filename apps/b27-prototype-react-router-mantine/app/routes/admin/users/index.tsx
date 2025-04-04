import { eq } from "drizzle-orm";
import db from "~/lib/db/index.server";
import { rolesTable, userRolesTable, usersTable } from "~/lib/db/schema";
import { Table, Checkbox, Anchor } from "@mantine/core";

export const loader = async () => {
	const users = await db
		.select({
			id: usersTable.id,
			name: usersTable.name,
			email: usersTable.email,
			role: rolesTable.name,
		})
		.from(usersTable)
		.innerJoin(userRolesTable, eq(userRolesTable.userId, usersTable.id))
		.innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id));
	console.log(users);
	return { users };
};

const UserTable = ({
	users,
}: {
	users: { id: number; name: string; email: string; role: string }[];
}) => {
	const rows = users.map((user) => {
		return (
			<Table.Tr key={user.id}>
				<Table.Td>
					<Anchor href={`/admin/users/${user.id}`}>
						{user.name}
					</Anchor>
				</Table.Td>
				<Table.Td>{user.email}</Table.Td>
				<Table.Td>{user.role}</Table.Td>
			</Table.Tr>
		);
	});
	return (
		<Table striped highlightOnHover withTableBorder withColumnBorders>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>Name</Table.Th>
					<Table.Th>Email</Table.Th>
					<Table.Th>Role</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>{rows}</Table.Tbody>
		</Table>
	);
};

export default function Users({
	loaderData,
}: {
	loaderData: {
		users: { id: number; name: string; email: string; role: string }[];
	};
}) {
	const { users } = loaderData;
	return (
		<div>
			<h1>Users</h1>
			<UserTable users={users} />
		</div>
	);
}
