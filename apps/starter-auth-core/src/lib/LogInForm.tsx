"use client";
import { useActionState } from "react";
import { login } from "./actions/login";

export default function LogInForm() {
	const loginWithOptions = login.bind(null, {
		redirect: true,
		provider: "credentials",
		redirectTo: "/dashboard",
	});
	const [state, action, isPending] = useActionState(
		loginWithOptions,
		undefined
	);
	return (
		<form className="space-y-4" action={action}>
			<p className="text-red-500">{state?.message}</p>
			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium text-gray-700"
				>
					Email
				</label>
				<input
					autoFocus={true}
					type="email"
					id="email"
					name="email"
					autoComplete="email"
					defaultValue={state?.email ?? ""}
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
					autoComplete="current-password"
					defaultValue={state?.password ?? ""}
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
