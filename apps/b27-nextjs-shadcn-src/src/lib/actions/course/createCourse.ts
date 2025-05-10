"use server";
import { courses } from "@/courses";
import { CreateCourseDTO, UiCourseCreate } from "@pete_keen/courses/validators";

export async function createCourse(values: UiCourseCreate) {
	try {
		const course = convertUiCourseToCreateCourseDTO(values);
		return courses.course.create(course);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

function convertUiCourseToCreateCourseDTO(
	values: UiCourseCreate
): CreateCourseDTO {
	return {
		title: values.title,
		description: values.description,
		isPublished: values.isPublished,
		userId: values.userId,
		slots: values.slots.map((slot) => ({
			order: slot.order,
			moduleId: slot.moduleId,
			lessonId: slot.lessonId,
		})),
	};
}
