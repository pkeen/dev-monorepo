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
import type { ThiaUser } from "@/auth";

export function Avatar({
	user,
	className,
}: {
	user: ThiaUser;
	className?: string;
}) {
	return (
		<AvatarCn className={className}>
			<AvatarImage src={user?.image ?? undefined} />
			<AvatarFallback>{user?.name?.[0]}</AvatarFallback>
		</AvatarCn>
	);
}

export function AvatarOrSignin({ user }: { user: ThiaUser }) {
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
				{user.role.key === "admin" && (
					<DropdownMenuItem>Admin</DropdownMenuItem>
				)}
				<DropdownMenuItem>Profile</DropdownMenuItem>
				<DropdownMenuItem>Logout</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
