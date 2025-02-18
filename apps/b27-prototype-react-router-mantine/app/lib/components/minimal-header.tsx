import { Group } from "@mantine/core";
import type { User } from "@pete_keen/authentication-core";
import { Link } from "react-router";
import { useMantineTheme } from "@mantine/core";
import { AvatarOrSignin } from "./avatar-or-signin";
import { ColorSchemeSelector } from "./color-scheme-selector";
import { LogoGradientButton } from "./logo";

export function MinimalHeader({ user }: { user: User }) {
	const theme = useMantineTheme();
	return (
		<Group
			flex={1}
			style={{
				display: "flex",
				justifyContent: "space-between",
				padding: "0 0.5rem",
			}}
		>
			<Link to="/">
				<LogoGradientButton
					gradientFrom={theme.colors.indigo[6]}
					gradientTo={theme.colors.violet[6]}
				/>
			</Link>
			<Group>
				<ColorSchemeSelector />
				<AvatarOrSignin user={user} />
			</Group>
		</Group>
	);
}
