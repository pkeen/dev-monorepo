import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router";
import type { Route } from "./+types/layout";
import { withAuth } from "../auth";
import type { WithAuthHandlerArgs } from "@pete_keen/react-router-auth";
import Header from "~/lib/components/header";

const handler = async ({ request, user }: WithAuthHandlerArgs) => {
	return { user };
};

export const loader = withAuth(handler);

export default function Layout({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData;
	console.log(user);
	const [opened, { toggle }] = useDisclosure();

	return (
		<AppShell
			header={{ height: 60, offset: true }}
			// navbar={{
			// 	width: 300,
			// 	breakpoint: "sm",
			// 	collapsed: { mobile: !opened },
			// }}
			padding="md"
		>
			<AppShell.Header>
				{/* <Burger
					opened={opened}
					onClick={toggle}
					hiddenFrom="sm"
					size="sm"
				/>
				<div>Logo</div> */}
				<Header user={user} />
			</AppShell.Header>

			<AppShell.Navbar p="md">Navbar</AppShell.Navbar>

			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
		</AppShell>
	);
}
