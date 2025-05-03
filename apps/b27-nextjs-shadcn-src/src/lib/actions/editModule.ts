"use server";
import { courses } from "@/courses";
import {
	ModuleOutline,
	ModuleUpsertSlots,
} from "@pete_keen/courses/validators";
import {
	frontendModuleDTO,
	FrontendModule,
} from "@/lib/components/course-builder/modules/module-edit-form";

export const editModule = async (input: FrontendModule) => {
	const convertToModuleWithSlots = (
		module: FrontendModule
	): ModuleUpsertSlots => {
		const moduleWithSlots: ModuleUpsertSlots = {
			id: module.id,
			name: module.name,
			description: module.description,
			isPublished: module.isPublished,
			slots: module.slots.map((slot) => ({
				id: slot.id || undefined,
				moduleId: slot.moduleId,
				lessonId: slot.lessonId,
				order: slot.order,
			})),
		};
		return moduleWithSlots;
	};

	try {
		const module = await courses.module.updateWithSlots(
			convertToModuleWithSlots(input)
		);
		return module;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
