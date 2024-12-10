"use client";

const LogoutButton = ({ children }: { children: React.ReactNode }) => {
	return (
		<button
			onClick={async () => {
				await fetch("/api/auth/logout", {
					method: "POST",
				});
			}}
		>
			{children}
		</button>
	);
};

export default LogoutButton;