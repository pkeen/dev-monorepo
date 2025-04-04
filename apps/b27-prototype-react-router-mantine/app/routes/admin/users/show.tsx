import db from "~/lib/db/index.server";
import { usersTable, rolesTable, userRolesTable } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@mantine/core";
import { Link } from "react-router";

export const loader = async ({ params }: { params: { id: string } }) => {
	const { id } = params;
	const [user] = await db
		.select({
			id: usersTable.id,
			name: usersTable.name,
			image: usersTable.image,
			email: usersTable.email,
			role: rolesTable.name,
		})
		.from(usersTable)
		.innerJoin(userRolesTable, eq(userRolesTable.userId, usersTable.id))
		.innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
		.where(eq(usersTable.id, id));

	console.log("user in show.tsx", user);
	return { user };
};

export default function UserShow({
	loaderData,
}: {
	loaderData: { user: any };
}) {
	const { user } = loaderData;
	console.log("user in loader show.tsx", user);
	return (
		<div>
			<h1>{user.name}</h1>
			<p>{user.email}</p>
			<p>{user.role}</p>
			<img src={user.image} alt={user.name} />
			<Button component={Link} to={`/admin/users/${user.id}/edit`}>
				Edit
			</Button>
		</div>
	);
}
