// "use client";
import {
	IconBook,
	IconChartPie3,
	IconChevronDown,
	IconCode,
	IconCoin,
	IconFingerprint,
	IconNotification,
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
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./HeaderMegaMenu.module.css";
// import SignIn from "../SignIn";
// import { Sign } from "crypto";
// import AvatarOrSignin from "./AvatarOrSignIn";

const AvatarOrSignin = ({ user }: { user: any }) => {
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
						<Menu.Item>Logout</Menu.Item>
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

export default function NavMenu({ user }: { user: any }) {
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
		<Box pb={120}>
			<header className={classes.header}>
				<Group justify="space-between" h="100%">
					<MantineLogo size={30} />

					<Group h="100%" gap={0} visibleFrom="sm">
						<a href="#" className={classes.link}>
							About
						</a>
						{/* <HoverCard
							width={600}
							position="bottom"
							radius="md"
							shadow="md"
							withinPortal
						>
							<HoverCard.Target>
								<a href="#" className={classes.link}>
									<Center inline>
										<Box component="span" mr={5}>
											Features
										</Box>
										<IconChevronDown
											size={16}
											color={theme.colors.blue[6]}
										/>
									</Center>
								</a>
							</HoverCard.Target>

							<HoverCard.Dropdown style={{ overflow: "hidden" }}>
								<Group justify="space-between" px="md">
									<Text fw={500}>Features</Text>
									<Anchor href="#" fz="xs">
										View all
									</Anchor>
								</Group>

								<Divider my="sm" />

								<SimpleGrid cols={2} spacing={0}>
									{links}
								</SimpleGrid>

								<div className={classes.dropdownFooter}>
									<Group justify="space-between">
										<div>
											<Text fw={500} fz="sm">
												Get started
											</Text>
											<Text size="xs" c="dimmed">
												Their food sources have
												decreased, and their numbers
											</Text>
										</div>
										<Button variant="default">
											Get started
										</Button>
									</Group>
								</div>
							</HoverCard.Dropdown>
						</HoverCard> */}
						<a href="#" className={classes.link}>
							Courses
						</a>
						<a href="#" className={classes.link}>
							Academy
						</a>
					</Group>

					<Group visibleFrom="sm">
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
		</Box>
	);
}
