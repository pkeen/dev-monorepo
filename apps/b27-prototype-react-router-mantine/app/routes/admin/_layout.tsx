import { AppShell, Container, Paper } from "@mantine/core";
import { Outlet, useLoaderData } from "react-router";
import { MinimalHeader } from "~/lib/components/minimal-header";
import { requireAuth } from "~/auth.server";
import type { Route } from "./+types";
import { Nav } from "./_nav";

// export const loader = withAuth(async ({ user }) => {
// 	return { user };
// });

export const loader = async ({ request }: Route.LoaderArgs) => {
	const { user, headers } = await requireAuth(request, {
		redirectTo: "/",
	});
	return Response.json({ user }, { headers });
};

export default function AdminLayout() {
	const { user } = useLoaderData();
	return (
		<Paper>
			<AppShell
				header={{ height: 45 }}
				navbar={{ width: 300, breakpoint: "md" }}
				style={{ flex: 1, display: "flex" }}
			>
				<AppShell.Header
					style={{
						display: "flex",
						padding: "1px 3px",
					}}
				>
					<MinimalHeader user={user} />
				</AppShell.Header>
				<AppShell.Navbar p="md" style={{ border: "1px solid red" }}>
					<Nav />
				</AppShell.Navbar>

				<AppShell.Main
					style={{
						display: "flex",
						border: "1px solid green",
						flex: 1,
					}}
				>
					<div
						style={{
							flex: 1,
							display: "flex",
							border: "1px solid red",
						}}
					>
						<Outlet />
					</div>
				</AppShell.Main>
			</AppShell>
		</Paper>
	);
}
