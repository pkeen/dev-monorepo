"use client";
// import { useActionState } from "react";
// // import { login } from "@/lib/auth/actions/login/action";

// export default function LoginForm() {
// 	// const [data, action, isPending] = useActionState(login, undefined);

// 	return (
// 		<form action={action} className="space-y-4">
// 			<div>
// 				<label
// 					htmlFor="email"
// 					className="block text-sm font-medium text-gray-700"
// 				>
// 					Email
// 				</label>
// 				<input
// 					type="email"
// 					id="email"
// 					name="email"
// 					defaultValue={data?.data.email ?? ""}
// 					required
// 					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700"
// 				/>
// 				{data?.errors?.email &&
// 					data.errors.email.map((error) => (
// 						<p key={error} className="text-red-500">
// 							{error}
// 						</p>
// 					))}
// 			</div>
// 			<div>
// 				<label
// 					htmlFor="password"
// 					className="block text-sm font-medium text-gray-700"
// 				>
// 					Password
// 				</label>
// 				<input
// 					type="password"
// 					id="password"
// 					name="password"
// 					defaultValue={data?.data.password ?? ""}
// 					required
// 					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700"
// 				/>
// 				{data?.errors?.password &&
// 					data.errors.password.map((error) => (
// 						<p key={error} className="text-red-500">
// 							{error}
// 						</p>
// 					))}
// 			</div>
// 			<button
// 				type="submit"
// 				disabled={isPending}
// 				className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
// 			>
// 				{!isPending ? "Sign in" : "Signing in..."}
// 			</button>
// 			{data?.errors?.db && (
// 				<p className="text-red-500">{data.errors.db}</p>
// 			)}
// 		</form>
// 	);
// }
