// "use client";
import {
	IconBook,
	IconChartPie3,
	IconChevronDown,
	IconCode,
	IconCoin,
	IconFingerprint,
	IconNotification,
	IconSun,
	IconMoon,
	IconSettings,
} from "@tabler/icons-react";
import {
	Anchor,
	Box,
	Burger,
	Button,
	Center,
	Collapse,
	Divider,
	Drawer,
	Group,
	HoverCard,
	ScrollArea,
	SimpleGrid,
	Text,
	ThemeIcon,
	UnstyledButton,
	useMantineTheme,
	Avatar,
	Menu,
	useMantineColorScheme,
	ActionIcon,
	Container,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./HeaderMegaMenu.module.css";
import { useFetcher } from "react-router";
// import SignIn from "../SignIn";
// import { Sign } from "crypto";
// import AvatarOrSignin from "./AvatarOrSignIn";

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

const ColorSchemeSelector = () => {
	const { colorScheme, setColorScheme } = useMantineColorScheme();

	return (
		<>
			<Menu>
				<Menu.Target>
					<ActionIcon radius="xl" size="lg" variant="default">
						{colorScheme === "dark" ? <IconMoon /> : <IconSun />}
					</ActionIcon>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Label>Toggle color scheme</Menu.Label>
					<Menu.Item
						leftSection={<IconSun />}
						onClick={() => setColorScheme("light")}
					>
						Light
					</Menu.Item>
					<Menu.Item
						leftSection={<IconMoon />}
						onClick={() => setColorScheme("dark")}
					>
						Dark
					</Menu.Item>
					<Menu.Item
						leftSection={<IconSettings />}
						onClick={() => setColorScheme("auto")}
					>
						System
					</Menu.Item>
				</Menu.Dropdown>
			</Menu>
		</>
	);
};

export default function NavMenu({ user }: { user: any }) {
	const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
		useDisclosure(false);
	const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
	const theme = useMantineTheme();

	return (
		<Box pb={120}>
			<header className={classes.header}>
				{/* <Container size="xl"> */}
				<Group justify="space-between" h="100%">
					<MantineLogo size={30} />

					<Group h="100%" gap={0} visibleFrom="sm">
						<a href="#" className={classes.link}>
							About
						</a>
						<a href="#" className={classes.link}>
							Courses
						</a>
						<a href="#" className={classes.link}>
							Academy
						</a>
					</Group>

					<Group visibleFrom="sm">
						<ColorSchemeSelector />
						<AvatarOrSignin user={user} />
						{/* <AvatarOrSignin /> */}
						{/* <Button variant="default">Log in</Button> */}
						{/* <SignIn>Login</SignIn>
						<Button>Sign up</Button> */}
					</Group>

					<Burger
						opened={drawerOpened}
						onClick={toggleDrawer}
						hiddenFrom="sm"
					/>
				</Group>
				{/* </Container> */}
			</header>

			<Drawer
				opened={drawerOpened}
				onClose={closeDrawer}
				size="100%"
				padding="md"
				title="Navigation"
				hiddenFrom="sm"
				zIndex={1000000}
			>
				<ScrollArea h="calc(100vh - 80px" mx="-md">
					<Divider my="sm" />

					<a href="#" className={classes.link}>
						Home
					</a>
					<UnstyledButton
						className={classes.link}
						onClick={toggleLinks}
					>
						<Center inline>
							<Box component="span" mr={5}>
								Features
							</Box>
							<IconChevronDown
								size={16}
								color={theme.colors.blue[6]}
							/>
						</Center>
					</UnstyledButton>
					<Collapse in={linksOpened}>{}</Collapse>
					<a href="#" className={classes.link}>
						Learn
					</a>
					<a href="#" className={classes.link}>
						Academy
					</a>

					<Divider my="sm" />

					<Group justify="center" grow pb="xl" px="md">
						<AvatarOrSignin user={user} />
						{/* <Button variant="default">Log in</Button> */}
						{/* <SignIn>Log In</SignIn> */}
						{/* <p>hello</p> */}
						{/* <Button>Sign up</Button> */}
					</Group>
				</ScrollArea>
			</Drawer>
		</Box>
	);
}
