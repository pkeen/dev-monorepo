// components/CourseEditWrapper.tsx
"use client";

import { CourseEditForm } from "@pete_keen/courses-ui";
import {
	EditCourseTreeDTO,
	Lesson,
	ModuleDTO,
} from "@pete_keen/courses/validators";
import { getModuleTree, updateCourseTree } from "@/lib/actions";

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
			onSubmit={updateCourseTree}
			onDelete={async (id) => {
				console.log(id);
				return;
			}}
			fetchModuleTree={getModuleTree}
		/>
	);
}
