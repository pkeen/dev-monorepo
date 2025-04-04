import db from "~/lib/db/index.server";
import { usersTable, rolesTable, userRolesTable } from "~/lib/db/schema";
import { eq } from "drizzle-orm";
import { Form, useNavigate, useLoaderData } from "react-router";
import { TextInput, NativeSelect, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export const loader = async ({ params }: { params: { id: string } }) => {
	const { id } = params;
	const [user] = await db
		.select({
			id: usersTable.id,
			name: usersTable.name,
			image: usersTable.image,
			email: usersTable.email,
			role: rolesTable.name,
			roleId: rolesTable.id,
		})
		.from(usersTable)
		.innerJoin(userRolesTable, eq(userRolesTable.userId, usersTable.id))
		.innerJoin(rolesTable, eq(userRolesTable.roleId, rolesTable.id))
		.where(eq(usersTable.id, id));
	const roles = await db
		.select({ name: rolesTable.name, id: rolesTable.id })
		.from(rolesTable);
	console.log(user);
	return { user, roles };
};

export default function UserEdit() {
	const { user, roles } = useLoaderData<typeof loader>();
	const form = useForm({
		initialValues: {
			name: user.name,
			email: user.email,
			role: user.roleId,
		},
	});
	const navigate = useNavigate();
	console.log("FORM IS DIRTY", form.isDirty(), form.values);
	useEffect(() => {
		console.log("✅ This component is hydrating on the client");
	}, []);
	return (
		<Form method="post" onSubmit={form.onSubmit(() => {})}>
			{/* <h1>{user.name}</h1> */}
			<TextInput label="Name" {...form.getInputProps("name")} required />
			<TextInput
				label="Email"
				{...form.getInputProps("email")}
				required
			/>
			<NativeSelect
				label="Role"
				{...form.getInputProps("role")}
				required
				data={roles.map((role) => ({
					value: role.id,
					label: role.name,
				}))}
			/>
			<Button type="submit" disabled={!form.isDirty()}>
				{form.isDirty()
					? "Save Changes (Enabled)"
					: "No Changes (Disabled)"}
			</Button>
			<Button variant="default" onClick={() => navigate(-1)}>
				Cancel
			</Button>
		</Form>
	);
}
