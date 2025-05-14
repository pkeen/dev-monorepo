"use server";
import { courses } from "@/courses";
import { CreateVideoDTO } from "@pete_keen/courses/validators";

export const createVideo = async (input: CreateVideoDTO) => {
	try {
		const video = await courses.video.create(input);
		return video;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
