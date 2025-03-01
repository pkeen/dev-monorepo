// import { Login } from "~/lib/components/login";
import type { DisplayProvider } from "@pete_keen/authentication-core";
import { redirect } from "react-router";
import { stateCookie } from "~/session.server";
import authSystem from "~/auth";

export const loader = async ({ request }: { request: Request }) => {
	const providers = authSystem.listProviders();
	return { providers };
};

export const action = async ({ request }: { request: Request }) => {
	const headers = new Headers(request.headers);
	const formData = await request.formData();
	const provider = formData.get("provider");
    console.log("PROVIDER in login from form:", provider);

	if (!provider) {
		redirect("/auth/login");
	}

	const authResult = await authSystem.login(provider?.toString());

	if (authResult.type === "redirect") {
		headers.append(
			"Set-Cookie",
			await stateCookie.serialize(authResult.state)
		);
		headers.set("Content-Type", "text/html");
		return redirect(authResult.url, { headers });
	}
};

export default function Login({
	loaderData,
}: {
	loaderData: { providers: DisplayProvider[] };
}) {
	const providers = loaderData.providers;

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
							// onClick={() => {
							// 	setSelectedProvider(provider.name);
							// 	// setIsSubmitting(true);
							// }}
							// onMouseEnter={() => setHover(true)}
							// onMouseLeave={() => setHover(false)}
							// disabled={isSubmitting} // disable the buttons while submitting
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
								// cursor: isSubmitting
								// 	? "not-allowed"
								// 	: "pointer",
								fontSize: "16px",

								transition: "all 0.2s ease",
							}}
						>
							{provider.name}
						</button>
					))}
				</div>
				{/* )} */}
			</form>
		</div>
	);
}
