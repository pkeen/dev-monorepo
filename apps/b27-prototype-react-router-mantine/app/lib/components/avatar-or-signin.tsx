import { Avatar, Button, Menu } from "@mantine/core";
import { useFetcher } from "react-router";
import type { User } from "@pete_keen/authentication-core";

export const AvatarOrSignin = ({ user }: { user: User | null }) => {
	const fetcher = useFetcher();

	return (
		<>
			{user ? (
				<Menu trigger="click-hover" openDelay={100} closeDelay={400}>
					<Menu.Target>
						<Avatar
							src={user.image ?? ""}
							alt={user.name ?? ""}
							name={user.name ?? ""}
							size="md"
						/>
					</Menu.Target>
					<Menu.Dropdown>
						<Menu.Item>Profile</Menu.Item>
						<Menu.Item
							onClick={() =>
								fetcher.submit(null, {
									method: "post",
									action: "/auth/logout",
								})
							}
						>
							Logout
						</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			) : (
				<>
					<Button variant="gradient" component="a" href="/auth/login">
						Sign in
					</Button>
				</>
			)}
		</>
	);
};
