import LogInForm from "~/components/LogInForm";
import { useActionData, useNavigation } from "react-router";
import { login } from "../../auth";

export const action = login;

export default function Login() {
	const actionData = useActionData<typeof action>();
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";
	return (
		<main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
			<LogInForm actionData={actionData} isSubmitting={isSubmitting} />
		</main>
	);
}
