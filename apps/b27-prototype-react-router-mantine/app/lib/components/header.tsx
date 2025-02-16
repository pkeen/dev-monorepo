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
import { Link, useFetcher } from "react-router";
import classes from "./header.module.css";
import { LogoGradientButton, LogoButton } from "./logo";

// const LogoButton = ({ color }: LogoButtonProps) => {
// 	const theme = useMantineTheme();

// 	// For example, choose a color based on the color scheme:
// 	const svgColor = theme.colors.violet[6];
// 	return (
// 		<ThemeIcon
// 			radius="xl"
// 			size="lg"
// 			variant="default"
// 			style={{ backgroundColor: "transparent" }}
// 		>
// 			<div style={{ color: svgColor }}>
// 				<Logo />
// 			</div>
// 		</ThemeIcon>
// 	);
// };

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
					<Button variant="gradient" component="a" href="/auth/login">
						Sign in
					</Button>
					{/* <Button
						variant="primary"
						component="a"
						href="/auth/signup"
						style={{ width: "auto" }}
					>
						Sign up
					</Button> */}
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

const mockdata = [
	{
		icon: IconCode,
		title: "Open source",
		description: "This Pokémon’s cry is very loud and distracting",
	},
	{
		icon: IconCoin,
		title: "Free for everyone",
		description: "The fluid of Smeargle’s tail secretions changes",
	},
	{
		icon: IconBook,
		title: "Documentation",
		description: "Yanma is capable of seeing 360 degrees without",
	},
	{
		icon: IconFingerprint,
		title: "Security",
		description: "The shell’s rounded shape and the grooves on its.",
	},
	{
		icon: IconChartPie3,
		title: "Analytics",
		description: "This Pokémon uses its flying ability to quickly chase",
	},
	{
		icon: IconNotification,
		title: "Notifications",
		description: "Combusken battles with the intensely hot flames it spews",
	},
];

export default function Header({ user }: { user: any }) {
	const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
		useDisclosure(false);
	const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
	const theme = useMantineTheme();

	const links = mockdata.map((item) => (
		<UnstyledButton className={classes.subLink} key={item.title}>
			<Group wrap="nowrap" align="flex-start">
				<ThemeIcon size={34} variant="default" radius="md">
					<item.icon size={22} color={theme.colors.blue[6]} />
				</ThemeIcon>
				<div>
					<Text size="sm" fw={500}>
						{item.title}
					</Text>
					<Text size="xs" c="dimmed">
						{item.description}
					</Text>
				</div>
			</Group>
		</UnstyledButton>
	));

	return (
		// <Group
		// 	justify="space-between"
		// 	pb={0}
		// 	style={{ border: "1px solid red" }}
		// >
		<>
			{/* <header className={classes.header}> */}
			{/* <Container size="lg" align-items="center"> */}
			<Group justify="space-between" h="100%" w="100%">
				<Link to="/">
					<LogoGradientButton
						gradientFrom={theme.colors.indigo[6]}
						gradientTo={theme.colors.violet[6]}
					/>
				</Link>

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
			{/* </header> */}

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
					<Collapse in={linksOpened}>{links}</Collapse>
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
			{/* // </Group> */}
			{/* </Container> */}
		</>
	);
}
