"use client";

import {
	Lesson,
	ModuleDTO,
	CourseDisplay,
	UiCourseDisplay,
	uiCourseDisplay,
} from "@pete_keen/courses/validators";
import { courseDisplayToUi } from "./utilities";
import { SortableTree } from "./SortableTree";

export function CourseEditForm({course}: {course: CourseDisplay}) {
	const uiCourse = courseDisplayToUi(course);

    return <SortableTree items={uiCourse.slots} />
}