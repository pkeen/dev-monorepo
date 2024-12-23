import LogInForm from "./LogInForm";
import { useActionData, useNavigation } from "@remix-run/react";
import { login } from "../../auth";

// export const action = async ({ request }: any) => {
// 	const formData = await request.formData();
// 	console.log("form data", formData);
// 	const { email, password } = Object.fromEntries(formData);
// 	const authState = await authSystem.authenticate({ email, password });
// 	console.log("authState", authState);
// 	return formData;
// };

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
