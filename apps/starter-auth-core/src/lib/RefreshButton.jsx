"use client";

const RefreshButton = () => {
	return (
		<button
			onClick={async () => {
				await fetch("/api/auth/refresh", {
					method: "POST",
				});
			}}
		>
			Refresh
		</button>
	);
};

export default RefreshButton;
