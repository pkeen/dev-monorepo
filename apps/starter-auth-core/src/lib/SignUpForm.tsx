"use client";
import { useActionState } from "react";
import { signup } from "./actions/signup";

type Props = {};

const SignUpForm = (props: Props) => {
	// Bind options to the signup action
	const signUpWithOptions = signup.bind(null, {
		redirectTo: "/dashboard",
		provider: "credentials",
	});
	const [state, action, isPending] = useActionState(
		signUpWithOptions,
		undefined
	);

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<form
				action={action} // Handles both options and formData
				className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg"
			>
				<h2 className="text-2xl font-semibold text-center text-gray-800">
					Sign Up
				</h2>
				<div>
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700"
					>
						Name
					</label>
					<input
						autoFocus={true}
						type="text"
						id="name"
						name="name"
						defaultValue={state?.data?.name?.toString()}
						className="text-gray-700 w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
					/>
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
						autoComplete="email"
						defaultValue={state?.data?.email?.toString()}
						className="text-gray-700 w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
						autoComplete="new-password"
						defaultValue={state?.data?.password?.toString()}
						className="text-gray-700 w-full px-4 py-2 mt-1 text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
					/>
				</div>
				<button
					type="submit"
					className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					disabled={isPending}
				>
					{isPending ? "Signing up..." : "Sign Up"}
				</button>
			</form>
		</div>
	);
};

export default SignUpForm;
