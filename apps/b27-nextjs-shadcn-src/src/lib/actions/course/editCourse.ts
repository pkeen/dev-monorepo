"use server";

import { courses } from "@/courses";
import { UiCourseDisplay, EditCourseDTO } from "@pete_keen/courses/validators";

export const editCourse = async (input: UiCourseDisplay) => {
	try {
		const course = await courses.course.update(convertUICourseToDTO(input));
		return courses.course.display(course.id);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const convertUICourseToDTO = (course: UiCourseDisplay): EditCourseDTO => {
	const courseWithSlots: EditCourseDTO = {
		id: course.id,
		userId: course.userId,
		title: course.title,
		description: course.description,
		isPublished: course.isPublished,
		slots: course.slots?.map((slot) => ({
			id: slot.id || undefined,
			courseId: slot.courseId,
			moduleId: slot.moduleId,
			lessonId: slot.lessonId,
			order: slot.order,
			moduleSlots: slot.moduleSlots?.map((moduleSlot) => ({
				id: moduleSlot.id || undefined,
				moduleId: moduleSlot.moduleId,
				lessonId: moduleSlot.lessonId,
				order: moduleSlot.order,
			})),
		})),
	};
	return courseWithSlots;
};
