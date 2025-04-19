import { ReactNode } from "react";

type LayoutProps = {
	header: ReactNode;
	sidebar: ReactNode;
	footer: ReactNode;
	children: ReactNode;
};

export function AdminLayout({
	header,
	sidebar,
	footer,
	children,
}: LayoutProps) {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Header */}
			<header className="border-b">{header}</header>

			{/* Main Content */}
			<div className="flex flex-1">
				{/* Sidebar */}
				<aside className="w-64 border-r">{sidebar}</aside>

				{/* Page Content */}
				<main className="flex-1 p-4 overflow-auto">{children}</main>
			</div>

			{/* Footer */}
			<footer className="border-t">{footer}</footer>
		</div>
	);
}
