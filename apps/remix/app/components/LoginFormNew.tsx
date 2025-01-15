import { Form } from "react-router";
import { LoginActionData } from "~/routes/auth/login";
import {
	useAuthState,
	CsrfHidden,
} from "@pete_keen/remix-authentication/components";
import {
	Title,
	Group,
	Button,
	Container,
	Stack,
	Center,
	TextInput,
} from "@mantine/core";

interface LogInFormProps {
	actionData?: LoginActionData;
	isSubmitting: boolean;
}

export default function LogInForm({
	actionData,
	isSubmitting,
}: LogInFormProps) {
	const { csrf } = useAuthState();
	console.log("csrfToken in login: ", csrf);
	return (
		<Container>
			<Center>
				<Form method="post" className="space-y-4">
					<Stack>
						<Title order={1}>Log In with Credentials</Title>
						<CsrfHidden />
						{actionData?.error && (
							<p className="text-red-500">{actionData.error}</p>
						)}

						<Group>
							<TextInput
								autoFocus={true}
								type="email"
								id="email"
								name="email"
								label="Email"
								placeholder="Your email"
								autoComplete="email"
								required
							/>
							{/* <label
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
							/> */}
						</Group>
						<Group>
							<TextInput
								type="password"
								id="password"
								name="password"
								label="Password"
								placeholder="Your password"
								autoComplete="current-password"
								required
							/>
							{/* <label
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
							/> */}
						</Group>
						<Group>
							<Button
								name="action"
								value="credentials"
								type="submit"
								disabled={isSubmitting}
								loading={isSubmitting}
							>
								{isSubmitting ? "Signing in..." : "Sign in"}
							</Button>
						</Group>
						<Group>
							<Button
								name="action"
								value="google"
								type="submit"
								disabled={isSubmitting}
								loading={isSubmitting}
							>
								Sign in with Google
							</Button>
							{/* <Button>Sign in with Github</Button> */}
						</Group>
					</Stack>
				</Form>
			</Center>
		</Container>
	);
}
