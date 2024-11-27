"use client";
import { useCsrfToken } from "@/lib/auth/context/AuthContext/CsrfTokenContext";

const CsrfRequiredButton = () => {
	const csrfToken = useCsrfToken();

	const handleClick = async () => {
		if (!csrfToken) return;
		try {
			const response = await fetch("/api/auth/csrf", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"CSRF-Token": csrfToken,
				},
			});
			const data = await response.json();
			console.log(data);
		} catch (error) {
			console.error("error:", error);
		}
	};
	return <button onClick={handleClick}>CsrfRequiredButton</button>;
};

export default CsrfRequiredButton;
