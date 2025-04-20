import {
	Avatar as AvatarCn,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { UserPublic as User } from "@pete_keen/authentication-core";

export function Avatar({
	user,
	className,
}: {
	user: User | null;
	className?: string;
}) {
	return (
		<AvatarCn className={className}>
			<AvatarImage src={user?.image ?? undefined} />
			<AvatarFallback>{user?.name?.[0]}</AvatarFallback>
		</AvatarCn>
	);
}

export function AvatarOrSignin({ user }: { user: User | null }) {
	if (!user) {
		return (
			<Button asChild variant="default">
				<a href="/api/thia/signin">Sign in</a>
			</Button>
		);
	}
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="cursor-pointer" user={user} />
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem>Profile</DropdownMenuItem>
				<DropdownMenuItem>Logout</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
