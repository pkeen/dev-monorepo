"use server";

import { EditCourseTreeDTO } from "@pete_keen/courses/validators";
import { courses } from "@/courses";

export async function updateCourseTree(data: EditCourseTreeDTO) {
	try {
		const course = await courses.course.updateTree(data);
		return course;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function getModuleTree(moduleId: number) {
	try {
		const moduleTree = await courses.module.tree(moduleId);
		return moduleTree;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
