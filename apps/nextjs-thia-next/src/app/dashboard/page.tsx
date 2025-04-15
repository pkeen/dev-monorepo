import { thia } from "@/auth";

export default async function Dashboard() {
	const user = await thia();
	console.log("USER:", user);
	if (!user) {
		return <div>Unauthorized</div>;
	}
	return (
		<>
			<div>Dashboard</div>
			<p>{user.role.name}</p>
		</>
	);
}
