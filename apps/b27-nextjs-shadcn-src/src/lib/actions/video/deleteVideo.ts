"use server";
import { courses } from "@/courses";

export const deleteVideo = async (id: number) => {
	try {
		await courses.video.destroy(id);
	} catch (error) {
		console.error(error);
		throw error;
	}
};
