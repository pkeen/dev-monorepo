"use server";
import { courses } from "@/courses";
import { CreateLessonDTO } from "@pete_keen/courses/validators";

export const createLesson = async (input: CreateLessonDTO) => {
	try {
		const lesson = await courses.lesson.create(input);
		return lesson;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
