// components/CourseEditWrapper.tsx
"use client";

import { CourseEditForm } from "@pete_keen/courses-ui";
import {
	EditCourseTreeDTO,
	Lesson,
	ModuleDTO,
} from "@pete_keen/courses/validators";

export function CourseEditWrapper({
	course,
	existingLessons = [],
	existingModules = [],
}: {
	course: EditCourseTreeDTO;
	existingLessons?: Lesson[];
	existingModules?: ModuleDTO[];
}) {
	return (
		<CourseEditForm
			course={course}
			existingLessons={existingLessons}
			existingModules={existingModules}
			onSubmit={async (values) => {
				console.log(values);
				return values;
			}}
			onDelete={async (id) => {
				console.log(id);
				return;
			}}
		/>
	);
}
