// components/CourseEditWrapper.tsx
"use client";

import { CourseEditForm } from "@pete_keen/courses-ui";
// import { EditCourseTreeDTO } from "@pete_keen/courses/validators";
import { updateCourseTree } from "@/lib/actions";
import {
	ContentItemDTO,
	EditCourseTreeDTO,
} from "@pete_keen/courses-remake/validators";

export function CourseEditWrapper({
	course,
	existingContent = [],
}: {
	course: EditCourseTreeDTO;
	existingContent?: ContentItemDTO[];
}) {
	return (
		<CourseEditForm
			course={course}
			existingContent={existingContent}
			onSubmit={updateCourseTree}
			onDelete={async (id) => {
				console.log(id);
				return;
			}}
		/>
	);
}
