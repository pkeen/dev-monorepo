"use server";

import {
	uiModuleCreateDTO,
	createModuleDTO,
	UiModuleCreate,
	CreateModuleDTO,
} from "@pete_keen/courses/validators";
import { courses } from "@/courses";

export const createModule = async (input: UiModuleCreate) => {
	const module = convertToCreateModuleDTO(input);
	try {
		const createdModule = await courses.module.create(module);
		return courses.module.get(createdModule.id);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const convertToCreateModuleDTO = (input: UiModuleCreate): CreateModuleDTO => {
	return {
		name: input.name,
		description: input.description,
		isPublished: input.isPublished,
		slots: input.slots.map((slot) => ({
			lessonId: slot.lessonId,
			order: slot.order,
		})),
	};
};
