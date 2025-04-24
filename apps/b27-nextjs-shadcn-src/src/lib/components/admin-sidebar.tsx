import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	LayoutDashboard,
	Users,
	Settings,
	LogOut,
	BookOpen,
} from "lucide-react";

const navItems = [
	{ href: "/admin", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/admin/users", label: "Users", icon: Users },
	{ href: "/admin/courses", label: "Courses", icon: BookOpen },   
	{ href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
	return (
		<aside className="h-full w-64 border-r bg-background p-4 flex flex-col justify-between">
			<nav className="space-y-1">
				{navItems.map(({ href, label, icon: Icon }) => (
					<Link key={href} href={href}>
						<Button
							variant="ghost"
							className="w-full justify-start gap-2 px-3 py-2 text-sm font-medium cursor-pointer"
						>
							<Icon className="h-4 w-4" />
							{label}
						</Button>
					</Link>
				))}
			</nav>

			<form action="/api/thia/signout" method="post">
				<Button
					type="submit"
					variant="ghost"
					className="w-full justify-start gap-2 px-3 py-2 text-sm text-red-600"
				>
					<LogOut className="h-4 w-4" />
					Logout
				</Button>
			</form>
		</aside>
	);
}
