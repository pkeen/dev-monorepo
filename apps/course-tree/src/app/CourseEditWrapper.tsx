// components/CourseEditWrapper.tsx
"use client";

import { CourseEditForm } from "@pete_keen/courses-ui";
import { EditCourseTreeDTO } from "@pete_keen/courses/validators";

export function CourseEditWrapper({ course }: { course: EditCourseTreeDTO }) {
	return (
		<CourseEditForm
			course={course}
			existingLessons={[]}
			existingModules={[]}
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
