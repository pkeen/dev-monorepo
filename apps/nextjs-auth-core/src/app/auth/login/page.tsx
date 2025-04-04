import { authManager } from "@/auth";
import type { DisplayProvider } from "@pete_keen/authentication-core";
import { Redirect } from "next";

export default async function Login() {
	const providers: DisplayProvider[] = await authManager.listProviders();

	return (
		<div
			style={{
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<form method="post" data-turbo="false">
				<div style={{ display: "inline-block" }}>
					<h1 style={{ textAlign: "center", fontSize: "22px" }}>
						Continue with
					</h1>
					{providers?.map((provider) => (
						<button
							key={provider.key}
							type="submit"
							name="provider"
							value={provider.key}
							style={{
								width: "100%",
								display: "block",
								color: provider.style.text,
								backgroundColor: provider.style.bg,
								border: "none",
								borderRadius: "4px",
								padding: "12px 20px",
								marginBottom: "10px",
								cursor: "pointer",
								fontSize: "16px",

								transition: "all 0.2s ease",
							}}
						>
							{provider.name}
						</button>
					))}
				</div>
			</form>
		</div>
	);
}
