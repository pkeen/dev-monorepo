import { thia } from "@/auth";
import { CsrfField, getCsrfTokenServer } from "@pete_keen/thia-next";

export default async function Dashboard() {
	const user = await thia();
	const csrfToken = await getCsrfTokenServer();
	console.log("CSRF Token:", csrfToken);

	if (!user) {
		return <div>Unauthorized</div>;
	}

	return (
		<>
			<div>Dashboard</div>
			<p>{user.role.name}</p>
			<form action="/api/thia/signout" method="post">
				<button type="submit">Logout</button>
				{CsrfField({ csrfToken })}
			</form>
		</>
	);
}
