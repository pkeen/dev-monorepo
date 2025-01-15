import LogInForm from "~/components/LogInForm";
import { useActionData, useNavigation, Form } from "react-router";
import { login } from "../../auth";
import { withCsrf } from "@pete_keen/remix-authentication";
import { Container, Button, Group } from "@mantine/core";

export type LoginActionData = {
	error?: string;
	data?: { email: string; password: string };
};

export const action = withCsrf(login);

export default function Login() {
	const actionData = useActionData<LoginActionData>();
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";
	return (
		<Container>
			<LogInForm actionData={actionData} isSubmitting={isSubmitting} />
			<Group>
				<Form method="post">
					<Button type="submit" value="google">
						Login with Google
					</Button>
				</Form>
			</Group>
		</Container>
	);
}
