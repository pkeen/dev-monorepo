import { AdminLayout } from "@/lib/components";
import { MinimalHeader } from "@/lib/components";
import { thia } from "@/auth";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await thia();
	return (
		<AdminLayout
			header={<MinimalHeader user={user} />}
			sidebar={null}
			footer={null}
			children={children}
		/>
	);
}
