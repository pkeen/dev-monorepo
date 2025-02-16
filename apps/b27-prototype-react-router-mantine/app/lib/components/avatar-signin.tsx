import { useFetcher } from "react-router";
import { Menu, Button, Avatar } from "@mantine/core";

const AvatarOrSignin = ({ user }: { user: any }) => {
	const fetcher = useFetcher();
	return (
		// <Group style={{ border: "1px solid red" }} justify="space-between">
		<>
			{user ? (
				<Menu trigger="click-hover" openDelay={100} closeDelay={400}>
					<Menu.Target>
						<Avatar src={user.image} alt={user.name} />
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
				// <Avatar src={user.image} alt={user.name} />
				<>
					<Button variant="default" component="a" href="/auth/login">
						Log in
					</Button>
					<Button
						variant="primary"
						component="a"
						href="/auth/signup"
						style={{ width: "auto" }}
					>
						Sign up
					</Button>
				</>
			)}

			{/* // </Group> */}
		</>
	);
};
