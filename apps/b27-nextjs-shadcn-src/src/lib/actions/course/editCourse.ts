"use server";

import { courses } from "@/courses";
import { UiCourse, CourseUpsertSlots } from "@pete_keen/courses/validators";

export const editCourse = async (input: UiCourse) => {
	const convertToCourseWithSlots = (course: UiCourse): CourseUpsertSlots => {
		const courseWithSlots: CourseUpsertSlots = {
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
		return course;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
