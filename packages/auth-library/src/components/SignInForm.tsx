"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {authClient} from 
import { authClient } from "@/lib/auth/utils";
import { useAccessToken } from "@/lib/auth/context/AuthContext/AccessTokenContext";
import { useCsrfToken } from "@/lib/auth/context/AuthContext/CsrfTokenContext";

export default function SignInForm() {
	const router = useRouter();
	// const [data, isPending, action] = useActionState(signIn, undefined);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [isPending, setIsPending] = useState(false);
	const [errors, setErrors] = useState({});
	const [message, setMessage] = useState("");
	const { accessToken, setAccessToken } = useAccessToken();
	const { csrfToken, setCsrfToken } = useCsrfToken();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
	// 	e.preventDefault();
	// 	setIsPending(true);
	// 	try {
	// 		const result = await fetch("/api/auth/signin", {
	// 			method: "POST",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 			body: JSON.stringify(formData),
	// 		});
	// 		const data = await result.json();
	// 		setMessage(data.message);
	// 	} catch (error) {
	// 		console.error(error);
	// 		setMessage("Connection Error: Try again later");
	// 	}
	// 	setIsPending(false);
	// 	router.push("/dashboard"); // redirect to dashboard
	// };

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		// using Axios
		e.preventDefault();
		setIsPending(true);
		try {
			const response = await authClient.post("/auth/signin", formData);
			setMessage(response.data.message);
			// setMessage(data.message);
			setIsPending(false);
			setAccessToken(response.data.accessToken);
			router.push("/dashboard"); // redirect to dashboard
		} catch (error) {
			console.error(error);
			setMessage("Connection Error: Try again later");
		}
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<p>{message}</p>
			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-gray-700"
				>
					Email
				</label>
				<input
					type="email"
					id="email"
					name="email"
					value={formData.email}
					onChange={handleChange}
					// defaultValue={data?.data.email ?? ""}
					required
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700"
				/>
			</div>
			<div>
				<label
					htmlFor="password"
					className="block text-sm font-medium text-gray-700"
				>
					Password
				</label>
				<input
					type="password"
					id="password"
					name="password"
					value={formData.password}
					onChange={handleChange}
					// defaultValue={data?.data.password ?? ""}
					required
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700"
				/>
			</div>
			<button
				type="submit"
				disabled={isPending}
				className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				{!isPending ? "Sign in" : "Signing in..."}
			</button>
		</form>
	);
}
