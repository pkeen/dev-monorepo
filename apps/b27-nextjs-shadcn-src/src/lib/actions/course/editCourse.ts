"use server";

import { courses } from "@/courses";
import { UiCourse, EditCourseDTO } from "@pete_keen/courses/validators";

export const editCourse = async (input: UiCourse) => {
	const convertToCourseWithSlots = (course: UiCourse): EditCourseDTO => {
		const courseWithSlots: EditCourseDTO = {
			id: course.id,
			userId: course.userId,
			title: course.title,
			description: course.description,
			isPublished: course.isPublished,
			slots: course.slots.map((slot) => ({
				id: slot.id || undefined,
				courseId: slot.courseId,
				moduleId: slot.moduleId,
				lessonId: slot.lessonId,
				order: slot.order,
			})),
		};
		return courseWithSlots;
	};

	try {
		const course = await courses.course.updateWithSlots(
			convertToCourseWithSlots(input)
		);
		return courses.course.get(course.id);
	} catch (error) {
		console.error(error);
		throw error;
	}
};
