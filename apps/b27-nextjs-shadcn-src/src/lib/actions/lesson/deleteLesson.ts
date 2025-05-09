"use server";
import { courses } from "@/courses";

export const deleteLesson = async (id: number) => {
	try {
		await courses.lesson.destroy(id);
	} catch (error) {
		console.error(error);
		throw error;
	}
};
