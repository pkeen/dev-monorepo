import { Form } from "react-router";
import {
	CsrfHidden,
	useAuthState,
} from "@pete_keen/remix-authentication/components";
import { SignupActionData } from "~/routes/auth/signup";

interface SignUpFormProps {
	actionData?: SignupActionData;
	isSubmitting: boolean;
}

export default function SignUpForm({
	actionData,
	isSubmitting,
}: SignUpFormProps) {
	return (
		<Form method="post" className="space-y-4">
			<CsrfHidden />
			{actionData?.error && (
				<p className="text-red-500">{actionData.error}</p>
			)}

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
					required
					className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-700"
				/>
			</div>
			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				{isSubmitting ? "Signing up..." : "Sign up"}
			</button>
		</Form>
	);
}
