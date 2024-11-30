"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useCsrfToken } from "@context/CsrfTokenContext";
import { authClient } from "@client/authClient";
import { useAccessToken } from "@context/AccessTokenContext";

export default function SignOutButton() {
	const router = useRouter();
	const { setAccessToken } = useAccessToken();
	const handleClick = async () => {
		try {
			const response = await authClient.post("/auth/signout");
			setAccessToken(null);
		} catch (error) {
			console.error("Sign out failed");
		}

		router.push("/auth/signin"); // redirect to signin page
	};

	return <button onClick={handleClick}>Sign Out</button>;
}
