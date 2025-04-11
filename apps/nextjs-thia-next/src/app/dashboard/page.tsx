import { auth } from "@/auth";

export default async function Dashboard() {
	const user = await auth();
	console.log("USER:", user);
	if (!user) {
		return <div>Unauthorized</div>;
	}
	return (
		<>
			<div>Dashboard</div>
			<p>{user.email}</p>
		</>
	);
}
