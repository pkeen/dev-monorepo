import { useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSettings, IconSun } from "@tabler/icons-react";
import { ActionIcon, Menu } from "@mantine/core";

export const ColorSchemeSelector = () => {
	const { colorScheme, setColorScheme } = useMantineColorScheme();

	return (
		<>
			<Menu>
				<Menu.Target>
					<ActionIcon radius="xl" size="lg" variant="default">
						{colorScheme === "dark" ? (
							<IconMoon />
						) : colorScheme === "light" ? (
							<IconSun />
						) : (
							<IconSettings />
						)}
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
