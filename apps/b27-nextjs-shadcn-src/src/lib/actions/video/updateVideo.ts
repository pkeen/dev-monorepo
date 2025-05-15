"use server";
import { courses } from "@/courses";
import { Video } from "@pete_keen/courses/validators";

export const updateVideo = async (input: Video) => {
	try {
		const video = await courses.video.update(input);
		return video;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
