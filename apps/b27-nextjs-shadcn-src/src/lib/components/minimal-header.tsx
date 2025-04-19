import type { UserPublic as User } from "@pete_keen/authentication-core";
import Link from "next/link";
import { Logo, GradientLogo } from "./logo";
import { GradientLogoButton } from "./logo-button";
import { AvatarOrSignin } from "./avatar";

export function MinimalHeader({ user }: { user: User | null }) {
	return (
		<div className="flex justify-between items-center">
			<Link href="/">
				<GradientLogoButton />
			</Link>
			{/* <Group>
				<ColorSchemeSelector /> */}
			<AvatarOrSignin user={user} />
			{/* </Group> */}
		</div>
	);
}
