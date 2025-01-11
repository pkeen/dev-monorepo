import SignUpForm from "~/components/SignUpForm";
import { useActionData, useNavigation } from "react-router";
import { signup } from "../../auth";
import { withCsrf } from "@pete_keen/remix-authentication";

export type SignupActionData = {
	error?: string;
	data?: { email: string; password: string };
};

export const action = withCsrf(signup);

export default function Signup() {
	const actionData = useActionData<SignupActionData>();
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";
	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
			<SignUpForm actionData={actionData} isSubmitting={isSubmitting} />
		</main>
	);
}
