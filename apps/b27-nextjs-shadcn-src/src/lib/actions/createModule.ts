"use server";
import { courses } from "@/courses";

type CreateModuleFormValues = {
	name: string;
	description?: string;
	isPublished?: boolean;
};

export const createModule = async (input: CreateModuleFormValues) => {
	try {
		const module = await courses.module.create(input);
		return module;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
