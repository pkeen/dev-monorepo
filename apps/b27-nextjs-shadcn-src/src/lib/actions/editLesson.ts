"use server";
import { courses } from "@/courses";
import { Lesson } from "@pete_keen/courses/validators";

export const editLesson = async (input: Lesson) => {
	try {
		const lesson = await courses.lesson.update(input);
		return lesson;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
