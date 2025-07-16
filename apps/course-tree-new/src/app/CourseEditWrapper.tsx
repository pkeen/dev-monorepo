// components/CourseEditWrapper.tsx
"use client";

import { CourseEditForm } from "@pete_keen/courses-ui";
// import { EditCourseTreeDTO } from "@pete_keen/courses/validators";
import { updateCourseTree, deleteCourse } from "@/lib/actions";
import {
	ContentItemDTO,
	EditCourseTreeDTO,
} from "@pete_keen/courses-core/validators";

export function CourseEditWrapper({
	course,
	existingContent = [],
    onSubmit,
    onDelete,
}: {
	course: EditCourseTreeDTO;
	existingContent?: ContentItemDTO[];
    onSubmit: (course: EditCourseTreeDTO) => Promise<void>;
    onDelete: (id: number) => Promise<void>;
}) {
	return (
		<CourseEditForm
			course={course}
			existingContent={existingContent}
			onSubmit={updateCourseTree}
			onDelete={deleteCourse}
		/>
	);
}
