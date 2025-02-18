import {
	Container,
	TextInput,
	Textarea,
	Button,
	Checkbox,
	Table,
	Fieldset,
} from "@mantine/core";
import { Form } from "react-router";
import { CourseManager } from "~/lib/courses/core";
import { requireAuth } from "~/auth";
import { useLoaderData } from "react-router";

const courseManager = CourseManager();

export const loader = async ({ request }) => {
	const { user } = await requireAuth(request, {
		redirectTo: "/auth/login",
	});
	return { user };
};

export const action = async ({ request }) => {
	const formData = await request.formData();
	const title = formData.get("title");
	const description = formData.get("description");
	const isPublished = formData.get("isPublished");
	const userId = formData.get("userId");
	const course = await courseManager.create({
		title,
		description,
		isPublished,
		userId,
	});
	return course;
};

// Possibly this should accept a userId string for maximum compatibility
export default function CreateCourse() {
	const { user } = useLoaderData();
	return (
		<Container>
			<h1>Create Course</h1>
			<Form method="post">
				<Fieldset legend="Course Information">
					<TextInput name="title" label="Title" />
					<Checkbox name="isPublished" label="Published" />
					<Textarea name="description" label="Description" />
					<input type="hidden" name="userId" value={user.id} />
				</Fieldset>
				<Fieldset legend="Course Content">
					<Table captionSide="top">
						{/* <Table.Caption>Course Content</Table.Caption> */}
						<Table.Th>
							<Table.Tr>
								<Table.Th>Number</Table.Th>
								<Table.Th>Name</Table.Th>
								<Table.Th>Published</Table.Th>
							</Table.Tr>
						</Table.Th>
						<Table.Tbody>
							<Table.Tr>
								<Table.Td>1</Table.Td>
								<Table.Td>Introduction</Table.Td>
								<Table.Td>
									<Checkbox
										name="isPublished"
										label="Published"
									/>
								</Table.Td>
							</Table.Tr>
							<Table.Tr>
								<Table.Td>
									<Button>+</Button>
								</Table.Td>
							</Table.Tr>
						</Table.Tbody>
					</Table>
				</Fieldset>
				<Button type="submit">Create Course</Button>
			</Form>
		</Container>
	);
}
