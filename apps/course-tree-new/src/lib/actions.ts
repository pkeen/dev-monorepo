"use server";

import { EditCourseTreeDTO } from "@pete_keen/courses-remake/validators";
import { courses } from "@/courses";

export async function updateCourseTree(data: EditCourseTreeDTO) {
	try {
		const course = await courses.course.update(data);
		return course;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

export async function deleteCourse(id: number) {
	try {
		await courses.course.destroy(id);
	} catch (error) {
		console.error(error);
		throw error;
	}
}

// export async function getModuleTree(moduleId: number) {
// 	try {
// 		const moduleTree = await courses.module.tree(moduleId);
// 		return moduleTree;
// 	} catch (error) {
// 		console.error(error);
// 		throw error;
// 	}
// }
