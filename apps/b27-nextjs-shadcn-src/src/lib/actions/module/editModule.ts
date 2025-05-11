"use server";
import { courses } from "@/courses";
import {
	EditModuleDTO,
	UiModule,
	UiModuleSlot,
} from "@pete_keen/courses/validators";

export const editModule = async (input: UiModule) => {
	try {
		const updatedModule = await courses.module.update(
			convertToModuleDTO(input)
		);
		return await courses.module.outline(updatedModule.id);
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const convertToModuleDTO = (module: UiModule): EditModuleDTO => {
	const moduleWithSlots: EditModuleDTO = {
		id: module.id,
		name: module.name,
		description: module.description,
		isPublished: module.isPublished,
		slots: module.slots.map((slot: UiModuleSlot) => ({
			id: slot.id || undefined,
			moduleId: module.id,
			lessonId: slot.lessonId,
			order: slot.order,
		})),
	};
	return moduleWithSlots;
};
