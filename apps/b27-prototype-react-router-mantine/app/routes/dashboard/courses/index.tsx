import { Table, Checkbox } from "@mantine/core";
import { useLoaderData } from "react-router";
import { CourseManager } from "~/lib/courses/core";
import type { Course } from "~/lib/courses/core/index.types";

export const loader = async () => {
	const courseManager = CourseManager();
	const courses = await courseManager.list();
	console.log(courses);
	return { courses };
};

export default function Courses() {
	const { courses } = useLoaderData();
	return (
		<div
			style={{
				display: "flex",
				border: "1px solid red",
				flex: 1,
				flexDirection: "column",
			}}
		>
			<div>
				<h1>Courses</h1>
			</div>
			<div>
				<CourseTable courses={courses} />
			</div>
		</div>
	);
}

const CourseTable = ({ courses }: { courses: Course[] }) => {
	const rows = courses.map((course) => {
		return (
			<Table.Tr key={course.id}>
				<Table.Td>{course.title}</Table.Td>
				<Table.Td>
					{course.isPublished ? "Published" : "Draft"}
				</Table.Td>
			</Table.Tr>
		);
	});
	return (
		<Table striped highlightOnHover withTableBorder withColumnBorders>
			<Table.Thead>
				<Table.Tr>
					<Table.Th>Title</Table.Th>
					<Table.Th>Published</Table.Th>
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>{rows}</Table.Tbody>
		</Table>
	);
};
