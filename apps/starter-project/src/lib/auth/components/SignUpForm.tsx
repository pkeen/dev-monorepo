"use client";
import Link from "next/link";
import { useState } from "react";
// import { useActionState } from "react";
// import { login } from "@/lib/auth/login/action";

export default function SignUpForm() {
	// const [data, action, isPending] = useActionState(login, undefined);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [isPending, setIsPending] = useState(false);
	const [errors, setErrors] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [message, setMessage] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const response = await fetch("/api/auth/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});

		const data = await response.json();
		setMessage(data.message || data.error);
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<p>Message: {message}</p>
			<div>
				<label
					htmlFor="name"
					className="block text-sm font-medium text-gray-700"
				>
					Name
				</label>
				<input
					type="text"
					id="name"
					name="name"
					onChange={handleChange}
					// defaultValue={data?.data.name ?? ""}
					required
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700"
				/>
				{/* {data?.errors?.name &&
					data.errors.name.map((error) => (
						<p key={error} className="text-red-500">
							{error}
						</p>
					))} */}
			</div>
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
					onChange={handleChange}
					// defaultValue={data?.data.email ?? ""}
					required
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700"
				/>
				{/* {data?.errors?.email &&
					data.errors.email.map((error) => (
						<p key={error} className="text-red-500">
							{error}
						</p>
					))} */}
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
					onChange={handleChange}
					// defaultValue={data?.data.password ?? ""}
					required
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700"
				/>
				{/* {data?.errors?.password &&
					data.errors.password.map((error) => (
						<p key={error} className="text-red-500">
							{error}
						</p>
					))} */}
			</div>
			<button
				type="submit"
				// disabled={isPending}
				className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				Sign Up
				{/* {!isPending ? "Sign in" : "Signing in..."} */}
			</button>
			{/* {data?.errors?.db && (
				<p className="text-red-500">{data.errors.db}</p>
			)} */}
			<Link href="/signin">Already have an account?</Link>
		</form>
	);
}
