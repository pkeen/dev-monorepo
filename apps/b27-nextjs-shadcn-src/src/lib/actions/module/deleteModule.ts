"use server";
import { courses } from "@/courses";

export const deleteModule = async (id: number) => {
	try {
		await courses.module.destroy(id);
	} catch (error) {
		console.error(error);
		throw error;
	}
};
