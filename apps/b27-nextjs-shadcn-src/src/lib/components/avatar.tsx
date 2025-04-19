import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserPublic as User } from "@pete_keen/authentication-core";

export function AvatarOrSignin({ user }: { user: User | null }) {
	return (
		<Avatar className="h-8 w-8">
			<AvatarImage src={user?.image ?? undefined} />
			<AvatarFallback>{user?.name?.[0]}</AvatarFallback>
		</Avatar>
	);
}
